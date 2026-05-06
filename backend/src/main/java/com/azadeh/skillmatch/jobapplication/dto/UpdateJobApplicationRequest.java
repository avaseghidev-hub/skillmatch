package com.azadeh.skillmatch.jobapplication.dto;

import com.azadeh.skillmatch.jobapplication.entity.ApplicationStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateJobApplicationRequest {

    private String companyName;

    private String jobTitle;

    private String jobUrl;

    private String location;

    private String workMode;

    private String source;

    private String jobDescription;

    private String notes;

    private ApplicationStatus status;
}