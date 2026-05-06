package com.azadeh.skillmatch.skillmatchresult.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SkillMatchResultResponse {

    private Long id;

    private Long jobApplicationId;

    private String skillsFoundInJob;

    private String matchedSkills;

    private String missingSkills;

    private Double matchScore;

    private String recommendation;
}