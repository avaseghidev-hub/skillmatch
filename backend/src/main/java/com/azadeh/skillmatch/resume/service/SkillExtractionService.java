package com.azadeh.skillmatch.resume.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SkillExtractionService {

    private static final List<String> KNOWN_SKILLS = List.of(
            "Java",
            "Spring Boot",
            "React",
            "TypeScript",
            "PostgreSQL",
            "Docker",
            "Kubernetes",
            "REST APIs",
            "HTML",
            "CSS",
            "JavaScript"
    );

    public List<String> extractSkills(String resumeText) {

        List<String> detectedSkills = new ArrayList<>();

        for (String skill : KNOWN_SKILLS) {

            if (resumeText.toLowerCase().contains(skill.toLowerCase())) {
                detectedSkills.add(skill);
            }
        }

        return detectedSkills;
    }
}