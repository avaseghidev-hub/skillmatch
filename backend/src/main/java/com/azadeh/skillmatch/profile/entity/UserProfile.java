package com.azadeh.skillmatch.profile.entity;

import com.azadeh.skillmatch.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String fullName;

    private String targetRole;

    private String location;

    private String preferredWorkMode;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String languages;

    @Column(columnDefinition = "TEXT")
    private String resumeText;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}