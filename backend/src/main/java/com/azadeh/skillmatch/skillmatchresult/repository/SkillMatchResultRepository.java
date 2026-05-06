package com.azadeh.skillmatch.skillmatchresult.repository;

import com.azadeh.skillmatch.skillmatchresult.entity.SkillMatchResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SkillMatchResultRepository extends JpaRepository<SkillMatchResult, Long> {

    Optional<SkillMatchResult> findByJobApplicationId(Long jobApplicationId);

    boolean existsByJobApplicationId(Long jobApplicationId);

    // Delete analysis result before deleting the application
    void deleteByJobApplicationId(Long jobApplicationId);

}