package com.azadeh.skillmatch.skillmatchresult.service;

import com.azadeh.skillmatch.jobapplication.entity.JobApplication;
import com.azadeh.skillmatch.jobapplication.repository.JobApplicationRepository;
import com.azadeh.skillmatch.profile.entity.UserProfile;
import com.azadeh.skillmatch.profile.repository.UserProfileRepository;
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

    public SkillMatchResultService(
            SkillMatchResultRepository skillMatchResultRepository,
            JobApplicationRepository jobApplicationRepository,
            UserProfileRepository userProfileRepository
    ) {
        this.skillMatchResultRepository = skillMatchResultRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.userProfileRepository = userProfileRepository;
    }

    // Analyze and persist the skill match result
    @Transactional
    public SkillMatchResultResponse analyzeJobApplication(CreateSkillMatchResultRequest request) {
        JobApplication jobApplication = jobApplicationRepository.findById(request.getJobApplicationId())
                .orElseThrow(() -> new RuntimeException("Job application not found"));

        UserProfile profile = userProfileRepository.findByUserId(jobApplication.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        // Reuse existing analysis result or create a new one
        SkillMatchResult result = skillMatchResultRepository
                .findByJobApplicationId(jobApplication.getId())
                .orElse(new SkillMatchResult());

        List<String> userSkills = splitSkills(profile.getSkills());

        String jobDescription = jobApplication.getJobDescription() == null
                ? ""
                : jobApplication.getJobDescription().toLowerCase();

        List<String> skillsFoundInJob = userSkills.stream()
                .filter(skill -> jobDescription.contains(skill.toLowerCase()))
                .toList();

        List<String> missingSkills = userSkills.stream()
                .filter(skill -> !jobDescription.contains(skill.toLowerCase()))
                .toList();

        double matchScore = userSkills.isEmpty()
                ? 0
                : ((double) skillsFoundInJob.size() / userSkills.size()) * 100;

        // Keep createdAt stable and refresh updatedAt on each analysis
        LocalDateTime now = LocalDateTime.now();

        if (result.getCreatedAt() == null) {
            result.setCreatedAt(now);
        }

        result.setJobApplication(jobApplication);
        result.setSkillsFoundInJob(String.join(", ", skillsFoundInJob));
        result.setMatchedSkills(String.join(", ", skillsFoundInJob));
        result.setMissingSkills(String.join(", ", missingSkills));
        result.setMatchScore(Math.round(matchScore * 100.0) / 100.0);
        result.setRecommendation(generateRecommendation(matchScore));
        result.setUpdatedAt(now);

        SkillMatchResult savedResult = skillMatchResultRepository.save(result);

        return mapToResponse(savedResult);
    }

    public SkillMatchResultResponse getResultByJobApplicationId(Long jobApplicationId) {
        SkillMatchResult result = skillMatchResultRepository.findByJobApplicationId(jobApplicationId)
                .orElseThrow(() -> new RuntimeException("Skill match result not found"));

        return mapToResponse(result);
    }

    private List<String> splitSkills(String skills) {
        if (skills == null || skills.isBlank()) {
            return List.of();
        }

        return Arrays.stream(skills.split(","))
                .map(String::trim)
                .filter(skill -> !skill.isBlank())
                .toList();
    }

    private String generateRecommendation(double matchScore) {
        if (matchScore >= 80) {
            return "Strong match. This job is highly aligned with your profile.";
        }

        if (matchScore >= 50) {
            return "Good match. Consider applying, but review the missing skills.";
        }

        return "Low match. You may need to improve the missing skills before applying.";
    }


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