package com.azadeh.skillmatch.profile.service;

import com.azadeh.skillmatch.common.exception.DuplicateResourceException;
import com.azadeh.skillmatch.common.exception.ResourceNotFoundException;
import com.azadeh.skillmatch.profile.dto.CreateUserProfileRequest;
import com.azadeh.skillmatch.profile.dto.UpdateUserProfileRequest;
import com.azadeh.skillmatch.profile.dto.UserProfileResponse;
import com.azadeh.skillmatch.profile.entity.UserProfile;
import com.azadeh.skillmatch.profile.repository.UserProfileRepository;
import com.azadeh.skillmatch.resume.service.ResumeParserService;
import com.azadeh.skillmatch.resume.service.SkillExtractionService;
import com.azadeh.skillmatch.user.entity.User;
import com.azadeh.skillmatch.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final ResumeParserService resumeParserService;
    private final SkillExtractionService skillExtractionService;

    public UserProfileService(
            UserProfileRepository userProfileRepository,
            UserRepository userRepository,
            ResumeParserService resumeParserService,
            SkillExtractionService skillExtractionService
    ) {
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
        this.resumeParserService = resumeParserService;
        this.skillExtractionService = skillExtractionService;
    }

    public UserProfileResponse createProfile(CreateUserProfileRequest request) {
        if (userProfileRepository.existsByUserId(request.getUserId())) {
            throw new DuplicateResourceException("Profile already exists for this user");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setFullName(request.getFullName());
        profile.setTargetRole(request.getTargetRole());
        profile.setLocation(request.getLocation());
        profile.setPreferredWorkMode(request.getPreferredWorkMode());
        profile.setSkills(request.getSkills());
        profile.setLanguages(request.getLanguages());
        profile.setResumeText(request.getResumeText());
        profile.setCreatedAt(LocalDateTime.now());
        profile.setUpdatedAt(LocalDateTime.now());

        UserProfile savedProfile = userProfileRepository.save(profile);

        return mapToResponse(savedProfile);
    }

    public UserProfileResponse getProfileByUserId(Long userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        return mapToResponse(profile);
    }

    public UserProfileResponse updateProfile(Long userId, UpdateUserProfileRequest request) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        if (request.getFullName() != null) {
            profile.setFullName(request.getFullName());
        }

        if (request.getTargetRole() != null) {
            profile.setTargetRole(request.getTargetRole());
        }

        if (request.getLocation() != null) {
            profile.setLocation(request.getLocation());
        }

        if (request.getPreferredWorkMode() != null) {
            profile.setPreferredWorkMode(request.getPreferredWorkMode());
        }

        if (request.getSkills() != null) {
            profile.setSkills(request.getSkills());
        }

        if (request.getLanguages() != null) {
            profile.setLanguages(request.getLanguages());
        }

        if (request.getResumeText() != null) {
            profile.setResumeText(request.getResumeText());
        }

        profile.setUpdatedAt(LocalDateTime.now());

        UserProfile updatedProfile = userProfileRepository.save(profile);

        return mapToResponse(updatedProfile);
    }

    private UserProfileResponse mapToResponse(UserProfile profile) {
        return new UserProfileResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getFullName(),
                profile.getTargetRole(),
                profile.getLocation(),
                profile.getPreferredWorkMode(),
                profile.getSkills(),
                profile.getLanguages(),
                profile.getResumeText()
        );
    }

    public UserProfileResponse uploadResume(Long userId, MultipartFile file) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        String resumeText = resumeParserService.extractTextFromPdf(file);
        List<String> skills = skillExtractionService.extractSkills(resumeText);

        profile.setResumeText(resumeText);
        profile.setSkills(String.join(", ", skills));
        profile.setUpdatedAt(LocalDateTime.now());

        UserProfile updatedProfile = userProfileRepository.save(profile);

        return mapToResponse(updatedProfile);
    }

}