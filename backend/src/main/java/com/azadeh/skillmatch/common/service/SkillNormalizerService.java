package com.azadeh.skillmatch.common.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SkillNormalizerService {

    private static final Map<String, String> SKILL_MAPPINGS = new HashMap<>();

    static {

        // JavaScript
        SKILL_MAPPINGS.put("js", "javascript");
        SKILL_MAPPINGS.put("javascript", "javascript");

        // TypeScript
        SKILL_MAPPINGS.put("ts", "typescript");
        SKILL_MAPPINGS.put("typescript", "typescript");

        // PostgreSQL
        SKILL_MAPPINGS.put("postgres", "postgresql");
        SKILL_MAPPINGS.put("postgresql", "postgresql");
        SKILL_MAPPINGS.put("postgre sql", "postgresql");

        // Spring
        SKILL_MAPPINGS.put("spring", "spring boot");
        SKILL_MAPPINGS.put("spring boot", "spring boot");

        // React
        SKILL_MAPPINGS.put("react.js", "react");
        SKILL_MAPPINGS.put("reactjs", "react");
        SKILL_MAPPINGS.put("react", "react");
    }

    // Normalize skill names for consistent comparison
    public String normalize(String skill) {

        if (skill == null || skill.isBlank()) {
            return "";
        }

        String normalized =
                skill.trim().toLowerCase();

        return SKILL_MAPPINGS.getOrDefault(
                normalized,
                normalized
        );
    }
}