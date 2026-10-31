
package com.backend.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.backend.model.PrintDocument;

@Service
public class FileStorageService {

    @Value("${quickprint.storage.path:quickprint-storage}")
    private String storagePath;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of("pdf", "jpg", "jpeg", "png");

    public PrintDocument storeFile(
            MultipartFile file,
            String jobId,
            String printColor,
            int copies) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a file.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "File size must not exceed 10 MB.");
        }

        if (copies < 1 || copies > 100) {
            throw new IllegalArgumentException(
                    "Copies must be between 1 and 100.");
        }

        if (!Set.of("BLACK_WHITE", "COLOR").contains(printColor)) {
            throw new IllegalArgumentException(
                    "Invalid print color.");
        }

        String originalName = file.getOriginalFilename();

        if (originalName == null || originalName.isBlank()) {
            throw new IllegalArgumentException("Invalid filename.");
        }

        // Prevent directory traversal and sanitize filename.
        String safeName = originalName
                .replace('\\', '/');

        safeName = safeName.substring(
                safeName.lastIndexOf('/') + 1);

        if (safeName.contains("..")) {
            throw new IllegalArgumentException("Invalid filename.");
        }

        String extension = safeName.substring(
                safeName.lastIndexOf('.') + 1)
                .toLowerCase();

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException(
                    "Only PDF, JPG, JPEG and PNG files are allowed.");
        }

        Path uploadDirectory = Paths.get(storagePath)
                .toAbsolutePath()
                .normalize()
                .resolve("uploads")
                .resolve(jobId)
                .normalize();

        Path uploadsRoot = Paths.get(storagePath)
                .toAbsolutePath()
                .normalize()
                .resolve("uploads")
                .normalize();

        if (!uploadDirectory.startsWith(uploadsRoot)) {
            throw new IllegalArgumentException("Invalid storage path.");
        }

        Files.createDirectories(uploadDirectory);

        String documentId = UUID.randomUUID().toString();

        String storedFilename = documentId + "." + extension;

        Path destination = uploadDirectory.resolve(storedFilename);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destination);
        }

        PrintDocument document = new PrintDocument();

        document.setDocumentId(documentId);
        document.setOriginalFilename(safeName);
        document.setStoredFilename(storedFilename);
        document.setContentType(file.getContentType());
        document.setFileSize(file.getSize());
        document.setPrintColor(printColor);
        document.setCopies(copies);

        return document;
    }

    public Path getDocumentPath(
            String jobId,
            String storedFilename) {

        Path uploadsRoot = Paths.get(storagePath)
                .toAbsolutePath()
                .normalize()
                .resolve("uploads")
                .normalize();

        Path documentPath = uploadsRoot
                .resolve(jobId)
                .resolve(storedFilename)
                .normalize();

        if (!documentPath.startsWith(uploadsRoot)
                || !documentPath.startsWith(
                        uploadsRoot.resolve(jobId).normalize())) {
            throw new IllegalArgumentException("Invalid file path.");
        }

        return documentPath;
    }

    public void deleteJobFiles(String jobId) throws IOException {

        Path uploadsRoot = Paths.get(storagePath)
                .toAbsolutePath()
                .normalize()
                .resolve("uploads")
                .normalize();

        Path jobDirectory = uploadsRoot
                .resolve(jobId)
                .normalize();

        if (!jobDirectory.startsWith(uploadsRoot)) {
            throw new IllegalArgumentException("Invalid job ID.");
        }

        if (Files.exists(jobDirectory)) {
            try (var paths = Files.walk(jobDirectory)) {
                for (Path path : paths
                        .sorted(java.util.Comparator.reverseOrder())
                        .toList()) {
                    Files.delete(path);
                }
            }
        }
    }
}
