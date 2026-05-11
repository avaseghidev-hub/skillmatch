package com.azadeh.skillmatch.jobdescription.service;

import com.azadeh.skillmatch.common.exception.FileProcessingException;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@Service
public class JobDescriptionOcrService {

    public String extractTextFromImage(MultipartFile file) {
        try {
            File tempFile = File.createTempFile("job-description-", file.getOriginalFilename());
            file.transferTo(tempFile);

            ITesseract tesseract = new Tesseract();
            tesseract.setLanguage("eng");
            tesseract.setDatapath("C:\\Program Files\\Tesseract-OCR\\tessdata");
            String text = tesseract.doOCR(tempFile);
            tempFile.delete();

            return text;
        } catch (Exception ex) {
            throw new FileProcessingException("Could not extract text from image file");
        }
    }
}