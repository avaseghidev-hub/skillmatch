package com.azadeh.skillmatch.skillmatchresult.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateSkillMatchResultRequest {

    @NotNull
    private Long jobApplicationId;
}