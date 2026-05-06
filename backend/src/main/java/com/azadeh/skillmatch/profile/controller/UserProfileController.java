package com.azadeh.skillmatch.profile.controller;

import com.azadeh.skillmatch.profile.dto.CreateUserProfileRequest;
import com.azadeh.skillmatch.profile.dto.UpdateUserProfileRequest;
import com.azadeh.skillmatch.profile.dto.UserProfileResponse;
import com.azadeh.skillmatch.profile.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profiles")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping
    public UserProfileResponse createProfile(@Valid @RequestBody CreateUserProfileRequest request) {
        return userProfileService.createProfile(request);
    }

    @GetMapping("/user/{userId}")
    public UserProfileResponse getProfileByUserId(@PathVariable Long userId) {
        return userProfileService.getProfileByUserId(userId);
    }

    @PutMapping("/user/{userId}")
    public UserProfileResponse updateProfile(
            @PathVariable Long userId,
            @RequestBody UpdateUserProfileRequest request
    ) {
        return userProfileService.updateProfile(userId, request);
    }
}