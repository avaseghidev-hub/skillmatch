package com.azadeh.skillmatch.skillmatchresult.controller;

import com.azadeh.skillmatch.skillmatchresult.dto.CreateSkillMatchResultRequest;
import com.azadeh.skillmatch.skillmatchresult.dto.SkillMatchResultResponse;
import com.azadeh.skillmatch.skillmatchresult.service.SkillMatchResultService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/skill-match-results")
public class SkillMatchResultController {

    private final SkillMatchResultService skillMatchResultService;

    public SkillMatchResultController(SkillMatchResultService skillMatchResultService) {
        this.skillMatchResultService = skillMatchResultService;
    }

    @PostMapping("/analyze")
    public SkillMatchResultResponse analyzeJobApplication(
            @Valid @RequestBody CreateSkillMatchResultRequest request
    ) {
        return skillMatchResultService.analyzeJobApplication(request);
    }

    @GetMapping("/job-application/{jobApplicationId}")
    public SkillMatchResultResponse getResultByJobApplicationId(
            @PathVariable Long jobApplicationId
    ) {
        return skillMatchResultService.getResultByJobApplicationId(jobApplicationId);
    }
}