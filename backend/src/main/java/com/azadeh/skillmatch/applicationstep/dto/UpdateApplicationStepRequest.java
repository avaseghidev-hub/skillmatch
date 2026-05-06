package com.azadeh.skillmatch.applicationstep.dto;

import com.azadeh.skillmatch.applicationstep.entity.ApplicationStepType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UpdateApplicationStepRequest {

    private ApplicationStepType type;

    private String title;

    private String description;

    private LocalDateTime scheduledAt;

    private LocalDateTime completedAt;
}