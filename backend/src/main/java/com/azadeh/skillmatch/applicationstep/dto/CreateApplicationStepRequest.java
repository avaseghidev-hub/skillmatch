package com.azadeh.skillmatch.applicationstep.dto;

import com.azadeh.skillmatch.applicationstep.entity.ApplicationStepType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateApplicationStepRequest {

    @NotNull
    private Long jobApplicationId;

    @NotNull
    private ApplicationStepType type;

    @NotBlank
    private String title;

    private String description;

    private LocalDateTime scheduledAt;
}