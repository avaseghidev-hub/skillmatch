package com.azadeh.skillmatch.jobapplication.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateJobApplicationRequest {

    @NotNull
    private Long userId;

    @NotBlank
    private String companyName;

    @NotBlank
    private String jobTitle;

    private String jobUrl;

    private String location;

    private String workMode;

    private String source;

    private String jobDescription;

    private String notes;
}