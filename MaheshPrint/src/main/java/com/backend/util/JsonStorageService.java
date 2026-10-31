
package com.backend.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.backend.model.PrintJob;

import jakarta.annotation.PostConstruct;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Service
public class JsonStorageService {

    @Value("${quickprint.storage.path:quickprint-storage}")
    private String storagePath;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private Path jobsFile;

    @PostConstruct
    public void initialize() throws IOException {

        Path dataDirectory = Path.of(storagePath, "data");

        Files.createDirectories(dataDirectory);

        jobsFile = dataDirectory.resolve("jobs.json");

        if (Files.notExists(jobsFile)) {
            Files.writeString(jobsFile, "[]");
        }
    }

    public synchronized List<PrintJob> getAllJobs() throws IOException {

        if (Files.notExists(jobsFile)) {
            return new ArrayList<>();
        }

        return objectMapper.readValue(
                jobsFile,
                new TypeReference<List<PrintJob>>() {}
        );
    }

    public synchronized void saveJob(PrintJob job) throws IOException {

        List<PrintJob> jobs = getAllJobs();

        jobs.add(job);

        writeJobs(jobs);
    }

    public synchronized PrintJob getJobById(String jobId)
            throws IOException {

        return getAllJobs()
                .stream()
                .filter(job -> job.getJobId().equals(jobId))
                .findFirst()
                .orElse(null);
    }

    public synchronized boolean deleteJob(String jobId)
            throws IOException {

        List<PrintJob> jobs = getAllJobs();

        boolean removed = jobs.removeIf(
                job -> job.getJobId().equals(jobId)
        );

        if (removed) {
            writeJobs(jobs);
        }

        return removed;
    }

    private void writeJobs(List<PrintJob> jobs) throws IOException {

        Path tempFile = jobsFile.resolveSibling("jobs.tmp");

        objectMapper.writerWithDefaultPrettyPrinter()
                .writeValue(tempFile, jobs);

        try {
            Files.move(
                    tempFile,
                    jobsFile,
                    StandardCopyOption.REPLACE_EXISTING,
                    StandardCopyOption.ATOMIC_MOVE
            );
        } catch (IOException e) {
            Files.move(
                    tempFile,
                    jobsFile,
                    StandardCopyOption.REPLACE_EXISTING
            );
        }
    }
}
