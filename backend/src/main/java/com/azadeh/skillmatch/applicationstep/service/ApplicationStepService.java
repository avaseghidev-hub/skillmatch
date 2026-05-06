package com.azadeh.skillmatch.applicationstep.service;

import com.azadeh.skillmatch.applicationstep.dto.ApplicationStepResponse;
import com.azadeh.skillmatch.applicationstep.dto.CreateApplicationStepRequest;
import com.azadeh.skillmatch.applicationstep.dto.UpdateApplicationStepRequest;
import com.azadeh.skillmatch.applicationstep.entity.ApplicationStep;
import com.azadeh.skillmatch.applicationstep.repository.ApplicationStepRepository;
import com.azadeh.skillmatch.jobapplication.entity.JobApplication;
import com.azadeh.skillmatch.jobapplication.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationStepService {

    private final ApplicationStepRepository applicationStepRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public ApplicationStepService(
            ApplicationStepRepository applicationStepRepository,
            JobApplicationRepository jobApplicationRepository
    ) {
        this.applicationStepRepository = applicationStepRepository;
        this.jobApplicationRepository = jobApplicationRepository;
    }

    public ApplicationStepResponse createStep(CreateApplicationStepRequest request) {
        JobApplication jobApplication = jobApplicationRepository.findById(request.getJobApplicationId())
                .orElseThrow(() -> new RuntimeException("Job application not found"));

        ApplicationStep step = new ApplicationStep();
        step.setJobApplication(jobApplication);
        step.setType(request.getType());
        step.setTitle(request.getTitle());
        step.setDescription(request.getDescription());
        step.setScheduledAt(request.getScheduledAt());
        step.setCreatedAt(LocalDateTime.now());
        step.setUpdatedAt(LocalDateTime.now());

        ApplicationStep savedStep = applicationStepRepository.save(step);

        return mapToResponse(savedStep);
    }

    public List<ApplicationStepResponse> getStepsByJobApplicationId(Long jobApplicationId) {
        return applicationStepRepository.findByJobApplicationIdOrderByCreatedAtAsc(jobApplicationId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ApplicationStepResponse getStepById(Long id) {
        ApplicationStep step = applicationStepRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application step not found"));

        return mapToResponse(step);
    }

    public ApplicationStepResponse updateStep(Long id, UpdateApplicationStepRequest request) {
        ApplicationStep step = applicationStepRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application step not found"));

        if (request.getType() != null) {
            step.setType(request.getType());
        }

        if (request.getTitle() != null) {
            step.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            step.setDescription(request.getDescription());
        }

        if (request.getScheduledAt() != null) {
            step.setScheduledAt(request.getScheduledAt());
        }

        if (request.getCompletedAt() != null) {
            step.setCompletedAt(request.getCompletedAt());
        }

        step.setUpdatedAt(LocalDateTime.now());

        ApplicationStep updatedStep = applicationStepRepository.save(step);

        return mapToResponse(updatedStep);
    }

    public void deleteStep(Long id) {
        if (!applicationStepRepository.existsById(id)) {
            throw new RuntimeException("Application step not found");
        }

        applicationStepRepository.deleteById(id);
    }

    private ApplicationStepResponse mapToResponse(ApplicationStep step) {
        return new ApplicationStepResponse(
                step.getId(),
                step.getJobApplication().getId(),
                step.getType(),
                step.getTitle(),
                step.getDescription(),
                step.getScheduledAt(),
                step.getCompletedAt()
        );
    }
}