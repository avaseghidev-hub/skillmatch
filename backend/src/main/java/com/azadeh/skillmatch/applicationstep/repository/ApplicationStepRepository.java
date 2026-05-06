package com.azadeh.skillmatch.applicationstep.repository;

import com.azadeh.skillmatch.applicationstep.entity.ApplicationStep;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationStepRepository extends JpaRepository<ApplicationStep, Long> {

    List<ApplicationStep> findByJobApplicationIdOrderByCreatedAtAsc(Long jobApplicationId);
    
    // Delete all steps for a job application before deleting the application
    void deleteByJobApplicationId(Long jobApplicationId);
}