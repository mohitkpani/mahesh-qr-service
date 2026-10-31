
package com.backend.model;

import java.util.ArrayList;
import java.util.List;

public class PrintJob {

    private String jobId;
    private String customerName;
    private String mobileNumber;
    private String createdAt;

    private List<PrintDocument> documents = new ArrayList<>();

    public PrintJob() {
    }

    public PrintJob(String jobId, String customerName,
                    String mobileNumber, String createdAt,
                    List<PrintDocument> documents) {
        this.jobId = jobId;
        this.customerName = customerName;
        this.mobileNumber = mobileNumber;
        this.createdAt = createdAt;
        this.documents = documents;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public List<PrintDocument> getDocuments() {
        return documents;
    }

    public void setDocuments(List<PrintDocument> documents) {
        this.documents = documents;
    }
}
