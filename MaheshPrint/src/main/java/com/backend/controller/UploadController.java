
package com.backend.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.backend.model.PrintJob;
import com.backend.service.JobService;

@RestController
@RequestMapping("/api")
public class UploadController {

    private final JobService jobService;

    public UploadController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping(
        value = "/upload",
        consumes = "multipart/form-data"
    )
    public ResponseEntity<?> uploadDocuments(
            @RequestParam String customerName,
            @RequestParam(required = false) String mobileNumber,
            @RequestParam MultipartFile[] files,
            @RequestParam(defaultValue = "BLACK_WHITE") String printColor,
            @RequestParam(defaultValue = "1") int copies) {

        try {
            PrintJob job = jobService.createJob(
                    customerName,
                    mobileNumber,
                    files,
                    printColor,
                    copies
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "success", true,
                            "message", "Documents uploaded successfully!",
                            "jobId", job.getJobId()
                    ));

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));

        } catch (IOException e) {

            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Unable to save documents."
                    ));
        }
    }
}
