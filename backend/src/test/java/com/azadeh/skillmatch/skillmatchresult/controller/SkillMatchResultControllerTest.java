package com.azadeh.skillmatch.skillmatchresult.controller;

import com.azadeh.skillmatch.auth.security.JwtAuthenticationFilter;
import com.azadeh.skillmatch.auth.security.JwtService;
import com.azadeh.skillmatch.common.exception.ApiExceptionHandler;
import com.azadeh.skillmatch.common.exception.ResourceNotFoundException;
import com.azadeh.skillmatch.skillmatchresult.dto.SkillMatchResultResponse;
import com.azadeh.skillmatch.skillmatchresult.service.SkillMatchResultService;
import com.azadeh.skillmatch.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import static org.springframework.http.MediaType.APPLICATION_JSON;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SkillMatchResultController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(ApiExceptionHandler.class)
class SkillMatchResultControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SkillMatchResultService skillMatchResultService;

    // Mock security dependencies to prevent loading real JWT logic.
    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    // Should return 200 OK and skill match result when analyze request is valid.
    @Test
    void analyzeJobApplication_ShouldReturnSkillMatchResult() throws Exception {

        SkillMatchResultResponse response =
                new SkillMatchResultResponse(
                        1L,
                        10L,
                        "React, JavaScript, PostgreSQL, Spring Boot",
                        "React, JavaScript",
                        "PostgreSQL, Spring Boot",
                        50.0,
                        "Good match. Consider applying, but review the missing skills."
                );

        when(skillMatchResultService.analyzeJobApplication(any()))
                .thenReturn(response);

        mockMvc.perform(post("/skill-match-results/analyze")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "jobApplicationId": 10
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.jobApplicationId").value(10))
                .andExpect(jsonPath("$.matchScore").value(50.0));
    }

    // Should return 400 Bad Request when required jobApplicationId is missing.
    @Test
    void analyzeJobApplication_ShouldReturnBadRequest_WhenRequestIsInvalid() throws Exception {

        mockMvc.perform(post("/skill-match-results/analyze")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    // Should return 200 OK and existing skill match result by job application id.
    @Test
    void getResultByJobApplicationId_ShouldReturnSkillMatchResult() throws Exception {

        SkillMatchResultResponse response =
                new SkillMatchResultResponse(
                        1L,
                        10L,
                        "React, JavaScript",
                        "React",
                        "JavaScript",
                        50.0,
                        "Good match. Consider applying, but review the missing skills."
                );

        when(skillMatchResultService.getResultByJobApplicationId(eq(10L)))
                .thenReturn(response);

        mockMvc.perform(get("/skill-match-results/job-application/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.jobApplicationId").value(10))
                .andExpect(jsonPath("$.matchScore").value(50.0));
    }

    // Should return 404 Not Found when skill match result does not exist.
    @Test
    void getResultByJobApplicationId_ShouldReturnNotFound_WhenResultDoesNotExist() throws Exception {

        when(skillMatchResultService.getResultByJobApplicationId(eq(999L)))
                .thenThrow(new ResourceNotFoundException("Skill match result not found"));

        mockMvc.perform(get("/skill-match-results/job-application/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Skill match result not found"))
                .andExpect(jsonPath("$.path").value("/skill-match-results/job-application/999"));
    }

}