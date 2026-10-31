
package com.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.model.PrintDocument;
import com.backend.model.PrintJob;
import com.backend.service.FileStorageService;
import com.backend.service.JobService;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final JobService jobService;
    private final FileStorageService fileStorageService;

    public AdminController(
            JobService jobService,
            FileStorageService fileStorageService) {

        this.jobService = jobService;
        this.fileStorageService = fileStorageService;
    }

    // Get all customer jobs
    @GetMapping("/jobs")
    public ResponseEntity<?> getAllJobs() {

        try {
            List<PrintJob> jobs = jobService.getAllJobs();

            return ResponseEntity.ok(jobs);

        } catch (IOException e) {
            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to retrieve customer jobs.");
        }
    }

    // Get individual customer job
    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<?> getJobById(
            @PathVariable String jobId) {

        try {
            PrintJob job = jobService.getJobById(jobId);

            if (job == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(job);

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Unable to retrieve job.");
        }
    }

    // Preview or download a customer document
    @GetMapping("/jobs/{jobId}/documents/{documentId}")
    public ResponseEntity<?> getDocument(
            @PathVariable String jobId,
            @PathVariable String documentId) {

        try {
            PrintJob job = jobService.getJobById(jobId);

            if (job == null) {
                return ResponseEntity.notFound().build();
            }

            PrintDocument document = job.getDocuments()
                    .stream()
                    .filter(d -> d.getDocumentId().equals(documentId))
                    .findFirst()
                    .orElse(null);

            if (document == null) {
                return ResponseEntity.notFound().build();
            }

            Path filePath = fileStorageService.getDocumentPath(
                    jobId,
                    document.getStoredFilename()
            );

            if (!Files.isRegularFile(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new FileSystemResource(filePath);

            String contentType = Files.probeContentType(filePath);

            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;

            if ("application/pdf".equalsIgnoreCase(contentType)) {
                mediaType = MediaType.APPLICATION_PDF;
            } else if ("image/jpeg".equalsIgnoreCase(contentType)) {
                mediaType = MediaType.IMAGE_JPEG;
            } else if ("image/png".equalsIgnoreCase(contentType)) {
                mediaType = MediaType.IMAGE_PNG;
            }

            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(mediaType);

            headers.setContentDisposition(
                    ContentDisposition.inline()
                            .filename(document.getOriginalFilename())
                            .build()
            );

            headers.setContentLength(Files.size(filePath));

            return new ResponseEntity<>(
                    resource,
                    headers,
                    HttpStatus.OK
            );

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Unable to open document.");
        }
    }

    // Close customer job and permanently delete its files
    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<?> closeJob(
            @PathVariable String jobId) {

        try {
            boolean deleted = jobService.closeJob(jobId);

            if (!deleted) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(
                    "Customer job and documents deleted successfully."
            );

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Unable to delete customer job.");
        }
    }
}
