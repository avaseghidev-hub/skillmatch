package com.azadeh.skillmatch.skillmatchresult.service;

import com.azadeh.skillmatch.common.exception.ResourceNotFoundException;
import com.azadeh.skillmatch.common.service.SkillNormalizerService;
import com.azadeh.skillmatch.jobapplication.entity.JobApplication;
import com.azadeh.skillmatch.jobapplication.repository.JobApplicationRepository;
import com.azadeh.skillmatch.profile.entity.UserProfile;
import com.azadeh.skillmatch.profile.repository.UserProfileRepository;
import com.azadeh.skillmatch.resume.service.SkillExtractionService;
import com.azadeh.skillmatch.skillmatchresult.dto.CreateSkillMatchResultRequest;
import com.azadeh.skillmatch.skillmatchresult.dto.SkillMatchResultResponse;
import com.azadeh.skillmatch.skillmatchresult.entity.SkillMatchResult;
import com.azadeh.skillmatch.skillmatchresult.repository.SkillMatchResultRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class SkillMatchResultService {

    private final SkillMatchResultRepository skillMatchResultRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserProfileRepository userProfileRepository;
    private final SkillExtractionService skillExtractionService;
    private final SkillNormalizerService skillNormalizerService;

    public SkillMatchResultService(
            SkillMatchResultRepository skillMatchResultRepository,
            JobApplicationRepository jobApplicationRepository,
            UserProfileRepository userProfileRepository,
            SkillExtractionService skillExtractionService,
            SkillNormalizerService skillNormalizerService
    ) {
        this.skillMatchResultRepository = skillMatchResultRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.userProfileRepository = userProfileRepository;
        this.skillExtractionService = skillExtractionService;
        this.skillNormalizerService = skillNormalizerService;
    }

    // Analyze a job application by id and return a response DTO
    @Transactional
    public SkillMatchResultResponse analyzeJobApplication(CreateSkillMatchResultRequest request) {
        JobApplication jobApplication = jobApplicationRepository.findById(request.getJobApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Job application not found"));

        SkillMatchResult savedResult = analyzeAndSave(jobApplication);

        return mapToResponse(savedResult);
    }

    // Analyze a saved job application entity and return the persisted result
    @Transactional
    public SkillMatchResult analyzeByJobApplication(JobApplication jobApplication) {
        return analyzeAndSave(jobApplication);
    }

    // Get the persisted analysis result for a job application
    public SkillMatchResultResponse getResultByJobApplicationId(Long jobApplicationId) {
        SkillMatchResult result = skillMatchResultRepository.findByJobApplicationId(jobApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill match result not found"));

        return mapToResponse(result);
    }

    // Core skill match logic shared by manual and automatic analysis
    private SkillMatchResult analyzeAndSave(JobApplication jobApplication) {
        UserProfile profile = userProfileRepository
                .findByUserId(jobApplication.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        SkillMatchResult result = skillMatchResultRepository
                .findByJobApplicationId(jobApplication.getId())
                .orElse(new SkillMatchResult());

        List<String> userSkills = splitAndNormalizeSkills(profile.getSkills());

        String normalizedJobDescription = normalizeJobDescription(
                jobApplication.getJobDescription()
        );

        List<String> jobSkills = skillExtractionService.extractSkills(normalizedJobDescription)
                .stream()
                .map(skillNormalizerService::normalize)
                .distinct()
                .toList();

        List<String> matchedSkills = jobSkills.stream()
                .filter(userSkills::contains)
                .toList();

        List<String> missingSkills = jobSkills.stream()
                .filter(jobSkill -> !userSkills.contains(jobSkill))
                .toList();

        double matchScore = jobSkills.isEmpty()
                ? 0
                : ((double) matchedSkills.size() / jobSkills.size()) * 100;

        LocalDateTime now = LocalDateTime.now();

        if (result.getCreatedAt() == null) {
            result.setCreatedAt(now);
        }

        result.setJobApplication(jobApplication);
        result.setSkillsFoundInJob(String.join(", ", formatSkills(jobSkills)));
        result.setMatchedSkills(String.join(", ", formatSkills(matchedSkills)));
        result.setMissingSkills(String.join(", ", formatSkills(missingSkills)));
        result.setMatchScore(Math.round(matchScore * 100.0) / 100.0);
        result.setRecommendation(generateRecommendation(matchScore));
        result.setUpdatedAt(now);

        return skillMatchResultRepository.save(result);
    }

    // Split comma-separated profile skills and normalize them for comparison
    private List<String> splitAndNormalizeSkills(String skills) {
        if (skills == null || skills.isBlank()) {
            return List.of();
        }

        return Arrays.stream(skills.split(","))
                .map(String::trim)
                .filter(skill -> !skill.isBlank())
                .map(skillNormalizerService::normalize)
                .distinct()
                .toList();
    }

    // Normalize job description text before skill extraction
    private String normalizeJobDescription(String jobDescription) {
        if (jobDescription == null || jobDescription.isBlank()) {
            return "";
        }

        return jobDescription
                .toLowerCase()
                .replace("postgre sql", "postgresql")
                .replace("react.js", "react")
                .replace("reactjs", "react")
                .replace("node.js", "node")
                .replace("nodejs", "node");
    }

    // Format normalized skill names for readable API response
    private List<String> formatSkills(List<String> skills) {
        return skills.stream()
                .map(this::formatSkill)
                .toList();
    }

    // Convert normalized skill values to display-friendly labels
    private String formatSkill(String skill) {
        return switch (skill) {
            case "javascript" -> "JavaScript";
            case "typescript" -> "TypeScript";
            case "postgresql" -> "PostgreSQL";
            case "spring boot" -> "Spring Boot";
            case "react" -> "React";
            case "java" -> "Java";
            default -> skill;
        };
    }

    // Generate recommendation text based on match score
    private String generateRecommendation(double matchScore) {
        if (matchScore >= 80) {
            return "Strong match. This job is highly aligned with your profile.";
        }

        if (matchScore >= 50) {
            return "Good match. Consider applying, but review the missing skills.";
        }

        return "Low match. You may need to improve the missing skills before applying.";
    }

    // Map entity to API response DTO
    private SkillMatchResultResponse mapToResponse(SkillMatchResult result) {
        return new SkillMatchResultResponse(
                result.getId(),
                result.getJobApplication().getId(),
                result.getSkillsFoundInJob(),
                result.getMatchedSkills(),
                result.getMissingSkills(),
                result.getMatchScore(),
                result.getRecommendation()
        );
    }
}