import { useCallback, useEffect, useState } from "react";
import "./Dashboard.css";

import {
    Activity,
    CalendarDays,
    Clock3,
    Folder,
    Printer,
    Eye,
    Trash2,
    RefreshCw,
    LogOut,
    FileText,
    Settings,
    AlertCircle,
} from "lucide-react";

import API from "../Services/api";

function DashBoardPage({ onLogout }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [closingJob, setClosingJob] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const loadJobs = useCallback(async () => {
        try {
            setError("");

            const response = await API.get("/jobs");

            setJobs(Array.isArray(response.data) ? response.data : []);
            setLastUpdated(new Date());
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to connect to the server. Check whether the backend is running."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    const formatDate = (dateValue) => {
        if (!dateValue) return "—";

        const date = new Date(dateValue);

        return Number.isNaN(date.getTime())
            ? "—"
            : date.toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
    };

    const formatSize = (bytes) => {
        if (!bytes) return "0 KB";

        return bytes < 1024 * 1024
            ? `${(bytes / 1024).toFixed(1)} KB`
            : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const getDocumentUrl = (jobId, documentId) => {
        const baseURL = API.defaults.baseURL.replace(/\/$/, "");

        return `${baseURL}/jobs/${encodeURIComponent(jobId)}/documents/${encodeURIComponent(documentId)}`;
    };

    const openDocument = (jobId, documentId) => {
        const url = getDocumentUrl(jobId, documentId);

        window.open(url, "_blank", "noopener,noreferrer");
    };

    const handlePrint = (jobId, documentId) => {
        openDocument(jobId, documentId);
    };

    const handleCloseJob = async (job) => {
        const confirmed = window.confirm(
            `Close this job for ${job.customerName}?\n\nAll documents belonging to this customer will be permanently deleted.`
        );

        if (!confirmed) return;

        try {
            setClosingJob(job.jobId);

            await API.delete(`/jobs/${encodeURIComponent(job.jobId)}`);

            setJobs((previous) =>
                previous.filter((item) => item.jobId !== job.jobId)
            );
        } catch (err) {
            window.alert(
                err.response?.data?.message ||
                "Unable to close this job. Please try again."
            );
        } finally {
            setClosingJob(null);
        }
    };

    const totalDocuments = jobs.reduce(
        (total, job) => total + (job.documents?.length || 0),
        0
    );

    const totalStorage = jobs.reduce(
        (total, job) =>
            total +
            (job.documents || []).reduce(
                (sum, document) => sum + (document.fileSize || 0),
                0
            ),
        0
    );

    return (
        <div className="dashboard-page">

            {/* HEADER */}
            <header className="dashboard-header">

                <div className="brand">
                    <div className="brand-logo">MDS</div>

                    <div className="brand-text">
                        <h1>Mahesh Digital Studio</h1>
                        <p>Document Printing Dashboard</p>
                    </div>
                </div>

                <button
                    className="logout-button"
                    onClick={onLogout}
                    type="button"
                >
                    <LogOut size={18} />
                    Logout
                </button>

            </header>

            <main className="dashboard-content">

                {/* STATISTICS */}
                <section className="dashboard-stats">

                    <div className="stat-card">
                        <div className="stat-icon status-icon">
                            <Activity size={23} />
                        </div>

                        <div>
                            <strong>Active</strong>
                            <span>System Status</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <CalendarDays size={23} />
                        </div>

                        <div>
                            <strong>
                                {new Date().toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </strong>

                            <span>Today's Date</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <Folder size={23} />
                        </div>

                        <div>
                            <strong>{formatSize(totalStorage)}</strong>
                            <span>Uploaded Storage</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <FileText size={23} />
                        </div>

                        <div>
                            <strong>{totalDocuments}</strong>
                            <span>Total Documents</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <Clock3 size={23} />
                        </div>

                        <div>
                            <strong>
                                {lastUpdated.toLocaleTimeString("en-IN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </strong>

                            <span>Last Updated</span>
                        </div>
                    </div>

                    <button
                        className="stat-card settings-card"
                        onClick={() =>
                            window.alert("Settings will be added later.")
                        }
                    >
                        <Settings size={23} />
                        <strong>Settings</strong>
                    </button>

                </section>

                {/* DOCUMENTS */}
                <section className="documents-panel">

                    <div className="panel-heading">

                        <div className="panel-title">
                            <FileText size={25} />
                            <h2>Uploaded Files for Printing</h2>
                        </div>

                        <button
                            className="refresh-button"
                            onClick={loadJobs}
                            disabled={loading}
                        >
                            <RefreshCw size={17} />
                            Refresh
                        </button>

                    </div>

                    {error && (
                        <div className="dashboard-alert">
                            <AlertCircle size={19} />
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="dashboard-message">
                            <RefreshCw className="spin" size={28} />
                            <p>Loading uploaded documents...</p>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="dashboard-message">
                            <Folder size={42} />
                            <h3>No documents uploaded yet</h3>
                            <p>Customer uploads will appear here.</p>
                        </div>
                    ) : (
                        <div className="table-wrapper">

                            <table className="documents-table">

                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Time</th>
                                        <th>Customer Name</th>
                                        <th>File Name</th>
                                        <th>Size</th>
                                        <th>Type</th>
                                        <th>Color Mode</th>
                                        <th>Copies</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {jobs.flatMap((job, jobIndex) =>
                                        (job.documents || []).map(
                                            (document, documentIndex) => (
                                                <tr key={document.documentId}>

                                                    <td>
                                                        {jobIndex + documentIndex + 1}
                                                    </td>

                                                    <td>
                                                        {formatDate(job.createdAt)}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {job.customerName}
                                                        </strong>

                                                        {job.mobileNumber && (
                                                            <small className="mobile-number">
                                                                {job.mobileNumber}
                                                            </small>
                                                        )}
                                                    </td>

                                                    <td className="filename-cell">
                                                        {document.originalFilename}
                                                    </td>

                                                    <td>
                                                        {formatSize(document.fileSize)}
                                                    </td>

                                                    <td>
                                                        <span className="file-type">
                                                            {document.contentType?.includes("pdf")
                                                                ? "PDF"
                                                                : "Image"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`color-badge ${document.printColor === "COLOR"
                                                                    ? "color-mode"
                                                                    : "bw-mode"
                                                                }`}
                                                        >
                                                            {document.printColor === "COLOR"
                                                                ? "Color"
                                                                : "B & W"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {document.copies || 1}
                                                    </td>

                                                    <td>
                                                        <div className="action-buttons">

                                                            <button
                                                                className="action-button print-action"
                                                                onClick={() =>
                                                                    handlePrint(
                                                                        job.jobId,
                                                                        document.documentId
                                                                    )
                                                                }
                                                                title="Open document for printing"
                                                            >
                                                                <Printer size={15} />
                                                                Quick Print
                                                            </button>

                                                            <button
                                                                className="action-button open-action"
                                                                onClick={() =>
                                                                    openDocument(
                                                                        job.jobId,
                                                                        document.documentId
                                                                    )
                                                                }
                                                                title="Open document"
                                                            >
                                                                <Eye size={15} />
                                                                Open File
                                                            </button>

                                                            <button
                                                                className="action-button close-action"
                                                                onClick={() =>
                                                                    handleCloseJob(job)
                                                                }
                                                                disabled={
                                                                    closingJob === job.jobId
                                                                }
                                                                title="Delete all documents for this customer"
                                                            >
                                                                <Trash2 size={15} />

                                                                {closingJob === job.jobId
                                                                    ? "Closing..."
                                                                    : "Close"}
                                                            </button>

                                                        </div>
                                                    </td>

                                                </tr>
                                            )
                                        )
                                    )}
                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

                <p className="dashboard-footnote">
                    Last refreshed:{" "}
                    {lastUpdated.toLocaleTimeString("en-IN")}
                </p>

            </main>
        </div>
    );
}

export default DashBoardPage;