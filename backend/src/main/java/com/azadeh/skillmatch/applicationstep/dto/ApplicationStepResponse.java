package com.azadeh.skillmatch.applicationstep.dto;

import com.azadeh.skillmatch.applicationstep.entity.ApplicationStepType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ApplicationStepResponse {

    private Long id;

    private Long jobApplicationId;

    private ApplicationStepType type;

    private String title;

    private String description;

    private LocalDateTime scheduledAt;

    private LocalDateTime completedAt;
}