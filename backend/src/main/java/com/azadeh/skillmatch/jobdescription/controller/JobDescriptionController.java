package com.azadeh.skillmatch.jobdescription.controller;

import com.azadeh.skillmatch.jobdescription.dto.JobDescriptionTextResponse;
import com.azadeh.skillmatch.jobdescription.service.JobDescriptionOcrService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/job-descriptions")
public class JobDescriptionController {

    private final JobDescriptionOcrService jobDescriptionOcrService;

    public JobDescriptionController(JobDescriptionOcrService jobDescriptionOcrService) {
        this.jobDescriptionOcrService = jobDescriptionOcrService;
    }

    @PostMapping("/extract-image")
    public JobDescriptionTextResponse extractFromImage(
            @RequestParam("file") MultipartFile file
    ) {
        String extractedText = jobDescriptionOcrService.extractTextFromImage(file);

        return new JobDescriptionTextResponse(extractedText);
    }
}