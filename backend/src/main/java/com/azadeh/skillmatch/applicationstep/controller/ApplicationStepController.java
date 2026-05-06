package com.azadeh.skillmatch.applicationstep.controller;

import com.azadeh.skillmatch.applicationstep.dto.ApplicationStepResponse;
import com.azadeh.skillmatch.applicationstep.dto.CreateApplicationStepRequest;
import com.azadeh.skillmatch.applicationstep.dto.UpdateApplicationStepRequest;
import com.azadeh.skillmatch.applicationstep.service.ApplicationStepService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/application-steps")
public class ApplicationStepController {

    private final ApplicationStepService applicationStepService;

    public ApplicationStepController(ApplicationStepService applicationStepService) {
        this.applicationStepService = applicationStepService;
    }

    @PostMapping
    public ApplicationStepResponse createStep(
            @Valid @RequestBody CreateApplicationStepRequest request
    ) {
        return applicationStepService.createStep(request);
    }

    @GetMapping("/job-application/{jobApplicationId}")
    public List<ApplicationStepResponse> getStepsByJobApplicationId(
            @PathVariable Long jobApplicationId
    ) {
        return applicationStepService.getStepsByJobApplicationId(jobApplicationId);
    }

    @GetMapping("/{id}")
    public ApplicationStepResponse getStepById(@PathVariable Long id) {
        return applicationStepService.getStepById(id);
    }

    @PutMapping("/{id}")
    public ApplicationStepResponse updateStep(
            @PathVariable Long id,
            @RequestBody UpdateApplicationStepRequest request
    ) {
        return applicationStepService.updateStep(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteStep(@PathVariable Long id) {
        applicationStepService.deleteStep(id);
    }
}