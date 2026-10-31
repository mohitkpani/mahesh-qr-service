
package com.backend.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.backend.model.PrintDocument;
import com.backend.model.PrintJob;
import com.backend.util.JsonStorageService;

@Service
public class JobService {

    private final JsonStorageService jsonStorageService;
    private final FileStorageService fileStorageService;
    private final SimpMessagingTemplate messagingTemplate;

    public JobService(
            JsonStorageService jsonStorageService,
            FileStorageService fileStorageService,
            SimpMessagingTemplate messagingTemplate) {

        this.jsonStorageService = jsonStorageService;
        this.fileStorageService = fileStorageService;
        this.messagingTemplate = messagingTemplate;
    }

    // Create customer print job
    public synchronized PrintJob createJob(
            String customerName,
            String mobileNumber,
            MultipartFile[] files,
            String printColor,
            int copies) throws IOException {

        if (files == null || files.length == 0) {
            throw new IllegalArgumentException(
                    "Please upload at least one document.");
        }

        if (customerName == null || customerName.isBlank()
                || customerName.length() > 100) {
            throw new IllegalArgumentException(
                    "Enter a valid customer name.");
        }

        if (mobileNumber != null && mobileNumber.length() > 20) {
            throw new IllegalArgumentException(
                    "Invalid mobile number.");
        }

        if (files.length > 10) {
            throw new IllegalArgumentException(
                    "Maximum 10 documents per submission.");
        }

        String jobId = "JOB-" +
                UUID.randomUUID().toString()
                        .substring(0, 8).toUpperCase();

        PrintJob job = new PrintJob();

        job.setJobId(jobId);
        job.setCustomerName(customerName.trim());
        job.setMobileNumber(mobileNumber);
        job.setCreatedAt(LocalDateTime.now().toString());

        List<PrintDocument> documents = new ArrayList<>();

        try {

            for (MultipartFile file : files) {

                PrintDocument document =
                        fileStorageService.storeFile(
                                file,
                                jobId,
                                printColor,
                                copies
                        );

                documents.add(document);
            }

            job.setDocuments(documents);

            // Save job in JSON storage
            jsonStorageService.saveJob(job);

            // Send real-time notification
            Map<String, Object> notification = Map.of(
                    "type", "NEW_JOB",
                    "jobId", job.getJobId()
            );

            messagingTemplate.convertAndSend(
                    "/topic/jobs",
                    (Object) notification
            );

            return job;

        } catch (IOException | RuntimeException exception) {

            try {
                fileStorageService.deleteJobFiles(jobId);
            } catch (IOException cleanupException) {
                exception.addSuppressed(cleanupException);
            }

            throw exception;
        }
    }

    // Get all customer jobs
    public List<PrintJob> getAllJobs() throws IOException {
        return jsonStorageService.getAllJobs();
    }

    // Get individual customer job
    public PrintJob getJobById(String jobId) throws IOException {
        return jsonStorageService.getJobById(jobId);
    }

    // Close and delete customer job

public synchronized boolean closeJob(String jobId)
        throws IOException {

    PrintJob job = jsonStorageService.getJobById(jobId);

    if (job == null) {
        return false;
    }

    // Delete customer documents
    fileStorageService.deleteJobFiles(jobId);

    // Delete customer record
    boolean deleted = jsonStorageService.deleteJob(jobId);

    if (deleted) {

        Map<String, Object> notification = Map.of(
                "type", "JOB_CLOSED",
                "jobId", jobId
        );

        messagingTemplate.send(
                "/topic/jobs",
                org.springframework.messaging.support.MessageBuilder
                        .withPayload(notification)
                        .build()
        );
    }

    return deleted;
}

}
