package com.azadeh.skillmatch.skillmatchresult.entity;

import com.azadeh.skillmatch.jobapplication.entity.JobApplication;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "skill_match_results")
public class SkillMatchResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_application_id", nullable = false, unique = true)
    private JobApplication jobApplication;

    @Column(columnDefinition = "TEXT")
    private String skillsFoundInJob;

    @Column(columnDefinition = "TEXT")
    private String matchedSkills;

    @Column(columnDefinition = "TEXT")
    private String missingSkills;

    @Column(nullable = false)
    private Double matchScore;

    @Column(columnDefinition = "TEXT")
    private String recommendation;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}