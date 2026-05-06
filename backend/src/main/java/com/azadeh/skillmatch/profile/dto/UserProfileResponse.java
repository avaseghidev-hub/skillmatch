package com.azadeh.skillmatch.profile.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;

    private Long userId;

    private String fullName;

    private String targetRole;

    private String location;

    private String preferredWorkMode;

    private String skills;

    private String languages;

    private String resumeText;
}