package com.azadeh.skillmatch.jobapplication.service;

import com.azadeh.skillmatch.common.exception.ResourceNotFoundException;
import com.azadeh.skillmatch.jobapplication.dto.CreateJobApplicationRequest;
import com.azadeh.skillmatch.jobapplication.dto.JobApplicationResponse;
import com.azadeh.skillmatch.jobapplication.dto.UpdateJobApplicationRequest;
import com.azadeh.skillmatch.jobapplication.entity.ApplicationStatus;
import com.azadeh.skillmatch.jobapplication.entity.JobApplication;
import com.azadeh.skillmatch.jobapplication.repository.JobApplicationRepository;
import com.azadeh.skillmatch.jobdescription.service.JobDescriptionOcrService;
import com.azadeh.skillmatch.skillmatchresult.dto.CreateSkillMatchResultRequest;
import com.azadeh.skillmatch.skillmatchresult.service.SkillMatchResultService;
import com.azadeh.skillmatch.user.entity.User;
import com.azadeh.skillmatch.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.azadeh.skillmatch.applicationstep.repository.ApplicationStepRepository;
import com.azadeh.skillmatch.skillmatchresult.repository.SkillMatchResultRepository;
import com.azadeh.skillmatch.skillmatchresult.dto.SkillMatchResultResponse;
import com.azadeh.skillmatch.skillmatchresult.entity.SkillMatchResult;
import org.springframework.web.multipart.MultipartFile;


import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;
    private final ApplicationStepRepository applicationStepRepository;
    private  final SkillMatchResultRepository skillMatchResultRepository;
    private final SkillMatchResultService skillMatchResultService;
    private final JobDescriptionOcrService jobDescriptionOcrService;

    public JobApplicationService(
            JobApplicationRepository jobApplicationRepository,
            UserRepository userRepository,
            ApplicationStepRepository applicationStepRepository,
            SkillMatchResultRepository skillMatchResultRepository,
            SkillMatchResultService skillMatchResultService,
            JobDescriptionOcrService jobDescriptionOcrService
    ) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
        this.applicationStepRepository = applicationStepRepository;
        this.skillMatchResultRepository = skillMatchResultRepository;
        this.skillMatchResultService = skillMatchResultService;
        this.jobDescriptionOcrService = jobDescriptionOcrService;
    }

    // Create a new job application and automatically analyze skill match
    public JobApplicationResponse createJobApplication(CreateJobApplicationRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        JobApplication jobApplication = new JobApplication();

        jobApplication.setUser(user);
        jobApplication.setCompanyName(request.getCompanyName());
        jobApplication.setJobTitle(request.getJobTitle());
        jobApplication.setJobUrl(request.getJobUrl());
        jobApplication.setLocation(request.getLocation());
        jobApplication.setWorkMode(request.getWorkMode());
        jobApplication.setSource(request.getSource());
        jobApplication.setJobDescription(request.getJobDescription());
        jobApplication.setNotes(request.getNotes());

        jobApplication.setStatus(ApplicationStatus.SAVED);

        jobApplication.setCreatedAt(LocalDateTime.now());
        jobApplication.setUpdatedAt(LocalDateTime.now());

        JobApplication savedJobApplication =
                jobApplicationRepository.save(jobApplication);

        // Automatically analyze skill match after saving application
        CreateSkillMatchResultRequest analyzeRequest =
                new CreateSkillMatchResultRequest();

        analyzeRequest.setJobApplicationId(savedJobApplication.getId());

        skillMatchResultService.analyzeJobApplication(analyzeRequest);

        return mapToResponse(savedJobApplication);
    }

    public List<JobApplicationResponse> getJobApplicationsByUserId(Long userId) {
        return jobApplicationRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public JobApplicationResponse getJobApplicationById(Long id) {
        JobApplication jobApplication = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job application not found"));

        return mapToResponse(jobApplication);
    }

    // Update an existing job application and refresh skill analysis
    public JobApplicationResponse updateJobApplication(
            Long id,
            UpdateJobApplicationRequest request
    ) {

        JobApplication jobApplication = jobApplicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job application not found"));

        if (request.getCompanyName() != null) {
            jobApplication.setCompanyName(request.getCompanyName());
        }

        if (request.getJobTitle() != null) {
            jobApplication.setJobTitle(request.getJobTitle());
        }

        if (request.getJobUrl() != null) {
            jobApplication.setJobUrl(request.getJobUrl());
        }

        if (request.getLocation() != null) {
            jobApplication.setLocation(request.getLocation());
        }

        if (request.getWorkMode() != null) {
            jobApplication.setWorkMode(request.getWorkMode());
        }

        if (request.getSource() != null) {
            jobApplication.setSource(request.getSource());
        }

        if (request.getJobDescription() != null) {
            jobApplication.setJobDescription(request.getJobDescription());
        }

        if (request.getNotes() != null) {
            jobApplication.setNotes(request.getNotes());
        }

        if (request.getStatus() != null) {
            jobApplication.setStatus(request.getStatus());
        }

        jobApplication.setUpdatedAt(LocalDateTime.now());

        JobApplication updatedJobApplication =
                jobApplicationRepository.save(jobApplication);

        // Re-run analysis after updating application data
        CreateSkillMatchResultRequest analyzeRequest =
                new CreateSkillMatchResultRequest();

        analyzeRequest.setJobApplicationId(updatedJobApplication.getId());

        skillMatchResultService.analyzeJobApplication(analyzeRequest);

        return mapToResponse(updatedJobApplication);
    }

    @Transactional
    public void deleteJobApplication(Long id) {
        if (!jobApplicationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job application not found");
        }

        // Delete child records first
        applicationStepRepository.deleteByJobApplicationId(id);
        skillMatchResultRepository.deleteByJobApplicationId(id);

        // Delete parent record
        jobApplicationRepository.deleteById(id);
    }

    private JobApplicationResponse mapToResponse(JobApplication jobApplication) {
        // Load persisted analysis result if it exists
        SkillMatchResultResponse skillMatchResultResponse = skillMatchResultRepository
                .findByJobApplicationId(jobApplication.getId())
                .map(this::mapSkillMatchResultToResponse)
                .orElse(null);

        return new JobApplicationResponse(
                jobApplication.getId(),
                jobApplication.getUser().getId(),
                jobApplication.getCompanyName(),
                jobApplication.getJobTitle(),
                jobApplication.getJobUrl(),
                jobApplication.getLocation(),
                jobApplication.getWorkMode(),
                jobApplication.getSource(),
                jobApplication.getJobDescription(),
                jobApplication.getNotes(),
                jobApplication.getStatus(),
                jobApplication.getCreatedAt(),
                jobApplication.getUpdatedAt(),
                skillMatchResultResponse
        );
    }

    private SkillMatchResultResponse mapSkillMatchResultToResponse(SkillMatchResult result) {
        // Map persisted analysis entity to response DTO
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

    public JobApplicationResponse createJobApplicationFromImage(
            Long userId,
            String companyName,
            String jobTitle,
            String jobUrl,
            String location,
            String workMode,
            String source,
            String notes,
            MultipartFile file
    ) {
        String extractedJobDescription = jobDescriptionOcrService.extractTextFromImage(file);

        CreateJobApplicationRequest request = new CreateJobApplicationRequest();
        request.setUserId(userId);
        request.setCompanyName(companyName);
        request.setJobTitle(jobTitle);
        request.setJobUrl(jobUrl);
        request.setLocation(location);
        request.setWorkMode(workMode);
        request.setSource(source);
        request.setNotes(notes);
        request.setJobDescription(extractedJobDescription);

        return createJobApplication(request);
    }

}