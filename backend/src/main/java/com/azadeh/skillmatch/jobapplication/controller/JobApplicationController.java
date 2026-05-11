package com.azadeh.skillmatch.jobapplication.controller;

import com.azadeh.skillmatch.jobapplication.dto.CreateJobApplicationRequest;
import com.azadeh.skillmatch.jobapplication.dto.JobApplicationResponse;
import com.azadeh.skillmatch.jobapplication.dto.UpdateJobApplicationRequest;
import com.azadeh.skillmatch.jobapplication.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/job-applications")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @PostMapping
    public JobApplicationResponse createJobApplication(
            @Valid @RequestBody CreateJobApplicationRequest request
    ) {
        return jobApplicationService.createJobApplication(request);
    }

    @GetMapping("/user/{userId}")
    public List<JobApplicationResponse> getJobApplicationsByUserId(@PathVariable Long userId) {
        return jobApplicationService.getJobApplicationsByUserId(userId);
    }

    @GetMapping("/{id}")
    public JobApplicationResponse getJobApplicationById(@PathVariable Long id) {
        return jobApplicationService.getJobApplicationById(id);
    }

    @PutMapping("/{id}")
    public JobApplicationResponse updateJobApplication(
            @PathVariable Long id,
            @RequestBody UpdateJobApplicationRequest request
    ) {
        return jobApplicationService.updateJobApplication(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteJobApplication(@PathVariable Long id) {
        jobApplicationService.deleteJobApplication(id);
    }

    @PostMapping("/from-image")
    public JobApplicationResponse createJobApplicationFromImage(
            @RequestParam Long userId,
            @RequestParam String companyName,
            @RequestParam String jobTitle,
            @RequestParam(required = false) String jobUrl,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String workMode,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String notes,
            @RequestParam("file") MultipartFile file
    ) {
        return jobApplicationService.createJobApplicationFromImage(
                userId,
                companyName,
                jobTitle,
                jobUrl,
                location,
                workMode,
                source,
                notes,
                file
        );
    }
}