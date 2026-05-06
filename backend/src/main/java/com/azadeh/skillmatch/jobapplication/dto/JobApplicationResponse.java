package com.azadeh.skillmatch.jobapplication.dto;

import com.azadeh.skillmatch.jobapplication.entity.ApplicationStatus;
import com.azadeh.skillmatch.skillmatchresult.dto.SkillMatchResultResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class JobApplicationResponse {

    private Long id;
    private Long userId;
    private String companyName;
    private String jobTitle;
    private String jobUrl;
    private String location;
    private String workMode;
    private String source;
    private String jobDescription;
    private String notes;
    private ApplicationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Include persisted analysis result in application responses
    private SkillMatchResultResponse skillMatchResult;
}