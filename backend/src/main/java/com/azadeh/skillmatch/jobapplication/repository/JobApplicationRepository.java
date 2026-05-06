package com.azadeh.skillmatch.jobapplication.repository;

import com.azadeh.skillmatch.jobapplication.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByUserId(Long userId);
}