package com.azadeh.skillmatch.skillmatchresult.service;

import com.azadeh.skillmatch.common.exception.ResourceNotFoundException;
import com.azadeh.skillmatch.common.service.SkillNormalizerService;
import com.azadeh.skillmatch.jobapplication.entity.ApplicationStatus;
import com.azadeh.skillmatch.jobapplication.entity.JobApplication;
import com.azadeh.skillmatch.jobapplication.repository.JobApplicationRepository;
import com.azadeh.skillmatch.profile.entity.UserProfile;
import com.azadeh.skillmatch.profile.repository.UserProfileRepository;
import com.azadeh.skillmatch.resume.service.SkillExtractionService;
import com.azadeh.skillmatch.skillmatchresult.dto.CreateSkillMatchResultRequest;
import com.azadeh.skillmatch.skillmatchresult.dto.SkillMatchResultResponse;
import com.azadeh.skillmatch.skillmatchresult.entity.SkillMatchResult;
import com.azadeh.skillmatch.skillmatchresult.repository.SkillMatchResultRepository;
import com.azadeh.skillmatch.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SkillMatchResultServiceTest {

    @Mock
    private SkillMatchResultRepository skillMatchResultRepository;

    @Mock
    private JobApplicationRepository jobApplicationRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private SkillExtractionService skillExtractionService;

    @Mock
    private SkillNormalizerService skillNormalizerService;

    @InjectMocks
    private SkillMatchResultService skillMatchResultService;

    private User user;
    private JobApplication jobApplication;
    private UserProfile profile;

    @BeforeEach
    void setUp() {

        user = new User();
        user.setId(1L);
        user.setName("Azadeh");
        user.setEmail("test@test.com");
        user.setPassword("password");
        user.setCreatedAt(LocalDateTime.now());

        jobApplication = new JobApplication();
        jobApplication.setId(10L);
        jobApplication.setUser(user);
        jobApplication.setCompanyName("Tech Corp");
        jobApplication.setJobTitle("Senior Full Stack Developer");
        jobApplication.setStatus(ApplicationStatus.SAVED);

        jobApplication.setJobDescription("""
                We are looking for React.js, JavaScript,
                Postgre SQL and Spring Boot developers
                """);

        profile = new UserProfile();
        profile.setId(100L);
        profile.setUser(user);
        profile.setFullName("Azadeh Vaseghi");
        profile.setSkills("React, JavaScript");
    }

    // Should calculate correct match score, matched skills,
    // missing skills, and recommendation text.
    @Test
    void analyzeJobApplication_ShouldReturnCorrectMatchResult() {

        CreateSkillMatchResultRequest request =
                new CreateSkillMatchResultRequest();

        request.setJobApplicationId(10L);

        when(jobApplicationRepository.findById(10L))
                .thenReturn(Optional.of(jobApplication));

        when(userProfileRepository.findByUserId(1L))
                .thenReturn(Optional.of(profile));

        when(skillMatchResultRepository.findByJobApplicationId(10L))
                .thenReturn(Optional.empty());

        when(skillExtractionService.extractSkills(anyString()))
                .thenReturn(List.of(
                        "react",
                        "javascript",
                        "postgresql",
                        "spring boot"
                ));

        when(skillNormalizerService.normalize(anyString()))
                .thenAnswer(invocation -> {
                    String skill =
                            invocation.getArgument(0, String.class);

                    return skill.trim()
                            .toLowerCase()
                            .replace("react.js", "react")
                            .replace("reactjs", "react")
                            .replace("postgre sql", "postgresql");
                });

        when(skillMatchResultRepository.save(any(SkillMatchResult.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        SkillMatchResultResponse response =
                skillMatchResultService.analyzeJobApplication(request);

        assertNotNull(response);

        assertEquals(50.0, response.getMatchScore());

        assertTrue(response.getMatchedSkills().contains("React"));
        assertTrue(response.getMatchedSkills().contains("JavaScript"));

        assertTrue(response.getMissingSkills().contains("PostgreSQL"));
        assertTrue(response.getMissingSkills().contains("Spring Boot"));

        assertEquals(
                "Good match. Consider applying, but review the missing skills.",
                response.getRecommendation()
        );
    }

    // Should throw exception when job application does not exist.
    @Test
    void analyzeJobApplication_ShouldThrow_WhenJobApplicationNotFound() {

        CreateSkillMatchResultRequest request =
                new CreateSkillMatchResultRequest();

        request.setJobApplicationId(999L);

        when(jobApplicationRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> skillMatchResultService.analyzeJobApplication(request)
        );

        verify(skillMatchResultRepository, never())
                .save(any());
    }

    // Should throw exception when user profile does not exist.
    @Test
    void analyzeJobApplication_ShouldThrow_WhenUserProfileNotFound() {

        CreateSkillMatchResultRequest request =
                new CreateSkillMatchResultRequest();

        request.setJobApplicationId(10L);

        when(jobApplicationRepository.findById(10L))
                .thenReturn(Optional.of(jobApplication));

        when(userProfileRepository.findByUserId(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> skillMatchResultService.analyzeJobApplication(request)
        );
    }

    // Should return 0 score when no skills are extracted
    // from the job description.
    @Test
    void analyzeJobApplication_ShouldReturnZeroScore_WhenNoSkillsFound() {

        CreateSkillMatchResultRequest request =
                new CreateSkillMatchResultRequest();

        request.setJobApplicationId(10L);

        jobApplication.setJobDescription("");

        when(jobApplicationRepository.findById(10L))
                .thenReturn(Optional.of(jobApplication));

        when(userProfileRepository.findByUserId(1L))
                .thenReturn(Optional.of(profile));

        when(skillMatchResultRepository.findByJobApplicationId(10L))
                .thenReturn(Optional.empty());

        when(skillExtractionService.extractSkills(anyString()))
                .thenReturn(List.of());

        when(skillMatchResultRepository.save(any(SkillMatchResult.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        SkillMatchResultResponse response =
                skillMatchResultService.analyzeJobApplication(request);

        assertEquals(0.0, response.getMatchScore());

        assertEquals(
                "Low match. You may need to improve the missing skills before applying.",
                response.getRecommendation()
        );
    }

    // Should update existing skill match result
    // instead of creating a new one.
    @Test
    void analyzeJobApplication_ShouldUpdateExistingResult() {

        SkillMatchResult existingResult =
                new SkillMatchResult();

        existingResult.setId(55L);
        existingResult.setCreatedAt(LocalDateTime.now());

        CreateSkillMatchResultRequest request =
                new CreateSkillMatchResultRequest();

        request.setJobApplicationId(10L);

        when(jobApplicationRepository.findById(10L))
                .thenReturn(Optional.of(jobApplication));

        when(userProfileRepository.findByUserId(1L))
                .thenReturn(Optional.of(profile));

        when(skillMatchResultRepository.findByJobApplicationId(10L))
                .thenReturn(Optional.of(existingResult));

        when(skillExtractionService.extractSkills(anyString()))
                .thenReturn(List.of("react"));

        when(skillNormalizerService.normalize(anyString()))
                .thenAnswer(invocation -> {
                    String skill =
                            invocation.getArgument(0, String.class);

                    return skill.trim()
                            .toLowerCase();
                });

        when(skillMatchResultRepository.save(any(SkillMatchResult.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        skillMatchResultService.analyzeJobApplication(request);

        ArgumentCaptor<SkillMatchResult> captor =
                ArgumentCaptor.forClass(SkillMatchResult.class);

        verify(skillMatchResultRepository)
                .save(captor.capture());

        SkillMatchResult saved = captor.getValue();

        assertEquals(55L, saved.getId());

        assertNotNull(saved.getUpdatedAt());

        assertNotNull(saved.getCreatedAt());
    }
}