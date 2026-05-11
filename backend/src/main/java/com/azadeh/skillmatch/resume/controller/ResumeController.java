package com.azadeh.skillmatch.resume.controller;

import com.azadeh.skillmatch.resume.service.ResumeParserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/resume")
public class ResumeController {

    private final ResumeParserService resumeParserService;

    public ResumeController(ResumeParserService resumeParserService) {
        this.resumeParserService = resumeParserService;
    }

    @PostMapping("/extract")
    public String extractResumeText(@RequestParam("file") MultipartFile file) {
        return resumeParserService.extractTextFromPdf(file);
    }
}