package com.azadeh.skillmatch.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserProfileRequest {

    @NotNull
    private Long userId;

    @NotBlank
    private String fullName;

    private String targetRole;

    private String location;

    private String preferredWorkMode;

    private String skills;

    private String languages;

    private String resumeText;
}