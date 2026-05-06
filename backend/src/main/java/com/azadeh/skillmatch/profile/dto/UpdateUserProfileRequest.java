package com.azadeh.skillmatch.profile.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserProfileRequest {

    private String fullName;

    private String targetRole;

    private String location;

    private String preferredWorkMode;

    private String skills;

    private String languages;

    private String resumeText;
}