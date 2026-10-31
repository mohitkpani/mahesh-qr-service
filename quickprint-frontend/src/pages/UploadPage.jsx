
import { useState } from "react";
import "./UploadPage.css";

import Footer from "../components/Footer";
import API from "../Services/api";

import {
    UploadCloud,
    FileText,
    Image,
    Trash2,
    Palette,
    Minus,
    Plus,
    LockKeyhole,
    LoaderCircle,
    CheckCircle,
} from "lucide-react";

function UploadPage() {
    const [files, setFiles] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [printColor, setPrintColor] = useState("BLACK_WHITE");
    const [copies, setCopies] = useState(1);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Handle file selection
    const handleFiles = (event) => {
        const selected = Array.from(event.target.files || []);

        setError("");
        setMessage("");

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
        ];

        const validFiles = selected.filter((file) => {
            if (!allowedTypes.includes(file.type)) {
                setError("Only PDF, JPG and PNG files are allowed.");
                return false;
            }

            if (file.size > 10 * 1024 * 1024) {
                setError(`${file.name} exceeds the 10 MB file limit.`);
                return false;
            }

            return true;
        });

        setFiles((previous) => {
            const combined = [...previous, ...validFiles];

            const unique = combined.filter(
                (file, index, array) =>
                    array.findIndex(
                        (item) =>
                            item.name === file.name &&
                            item.size === file.size &&
                            item.lastModified === file.lastModified
                    ) === index
            );

            if (unique.length > 10) {
                setError("You can upload a maximum of 10 documents.");
                return unique.slice(0, 10);
            }

            return unique;
        });

        event.target.value = "";
    };

    // Remove selected file
    const removeFile = (index) => {
        setFiles((previous) =>
            previous.filter((_, i) => i !== index)
        );
    };

    // Upload documents
    const handleUpload = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        if (!customerName.trim()) {
            setError("Please enter your name.");
            return;
        }

        if (!/^[0-9]{10}$/.test(mobileNumber)) {
            setError("Please enter a valid 10-digit mobile number.");
            return;
        }

        if (files.length === 0) {
            setError("Please select at least one document.");
            return;
        }

        const formData = new FormData();

        formData.append("customerName", customerName.trim());
        formData.append("mobileNumber", mobileNumber);
        formData.append("printColor", printColor);
        formData.append("copies", copies);

        files.forEach((file) => {
            formData.append("files", file);
        });

        try {
            setUploading(true);

            const response = await API.post("/upload", formData);

            setMessage(
                `Documents uploaded successfully! Your job ID is ${response.data.jobId || "created"
                }.`
            );

            setFiles([]);
            setCustomerName("");
            setMobileNumber("");
            setCopies(1);
            setPrintColor("BLACK_WHITE");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Upload failed. Please check your internet connection and try again."
            );
        } finally {
            setUploading(false);
        }
    };

    // Format file size
    const formatSize = (bytes) => {
        return bytes < 1024 * 1024
            ? `${(bytes / 1024).toFixed(1)} KB`
            : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <>
            <main className="upload-page">

                <form className="upload-card" onSubmit={handleUpload}>

                    {/* Complete Shop Banner Inside Upload Card */}
                    <div className="upload-brand">
                        <img
                            src="/mahesh-banner.png"
                            alt="Mahesh Digital Studio"
                        />
                    </div>

                    {/* Customer Details */}
                    <div className="section-heading">
                        <FileText size={23} />
                        <h2>Upload Your Documents</h2>
                    </div>

                    <div className="form-group">
                        <label htmlFor="customerName">
                            Customer Name
                        </label>

                        <input
                            id="customerName"
                            type="text"
                            placeholder="Enter your full name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            maxLength={80}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="mobileNumber">
                            Mobile Number
                        </label>

                        <input
                            id="mobileNumber"
                            type="tel"
                            placeholder="Enter 10-digit mobile number"
                            value={mobileNumber}
                            onChange={(e) =>
                                setMobileNumber(
                                    e.target.value.replace(/\D/g, "").slice(0, 10)
                                )
                            }
                            inputMode="numeric"
                        />
                    </div>

                    {/* Document Selection */}
                    <div className="section-heading">
                        <FileText size={23} />
                        <h2>Select Documents</h2>
                    </div>

                    <label className="file-drop-area">
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            multiple
                            onChange={handleFiles}
                            hidden
                        />

                        <UploadCloud size={48} />
                        <strong>Choose Files</strong>
                        <span>PDF, JPG, PNG (Max 10 MB each)</span>
                    </label>

                    {/* Selected Files */}
                    {files.length > 0 && (
                        <section className="selected-section">
                            <h3>Selected Files ({files.length})</h3>

                            {files.map((file, index) => (
                                <div
                                    className="file-item"
                                    key={`${file.name}-${file.lastModified}-${index}`}
                                >
                                    <div className="file-icon">
                                        {file.type === "application/pdf" ? (
                                            <FileText size={25} />
                                        ) : (
                                            <Image size={25} />
                                        )}
                                    </div>

                                    <div className="file-info">
                                        <strong>{file.name}</strong>
                                        <span>{formatSize(file.size)}</span>
                                    </div>

                                    <button
                                        type="button"
                                        className="remove-file"
                                        onClick={() => removeFile(index)}
                                        aria-label={`Remove ${file.name}`}
                                    >
                                        <Trash2 size={19} />
                                    </button>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Print Color */}
                    <div className="section-heading">
                        <Palette size={23} />
                        <h2>Print Color</h2>
                    </div>

                    <div className="color-options">
                        <button
                            type="button"
                            className={`color-option ${printColor === "BLACK_WHITE" ? "selected" : ""
                                }`}
                            onClick={() => setPrintColor("BLACK_WHITE")}
                        >
                            <FileText size={21} />
                            Black & White
                            <span className="radio-dot" />
                        </button>

                        <button
                            type="button"
                            className={`color-option ${printColor === "COLOR" ? "selected" : ""
                                }`}
                            onClick={() => setPrintColor("COLOR")}
                        >
                            <Palette size={21} />
                            Color
                            <span className="radio-dot" />
                        </button>
                    </div>

                    {/* Copies */}
                    <div className="copies-section">
                        <div className="section-heading">
                            <FileText size={23} />
                            <h2>Copies</h2>
                        </div>

                        <div className="copies-controls">
                            <button
                                type="button"
                                className="quantity-button"
                                onClick={() =>
                                    setCopies((value) => Math.max(1, value - 1))
                                }
                                disabled={copies <= 1}
                            >
                                <Minus size={20} />
                            </button>

                            <span className="copies-value">{copies}</span>

                            <button
                                type="button"
                                className="quantity-button"
                                onClick={() =>
                                    setCopies((value) => Math.min(100, value + 1))
                                }
                                disabled={copies >= 100}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="alert error-alert">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {message && (
                        <div className="alert success-alert">
                            <CheckCircle size={19} />
                            {message}
                        </div>
                    )}

                    {/* Upload Button */}
                    <button
                        type="submit"
                        className="upload-button"
                        disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <LoaderCircle className="spin" size={22} />
                                UPLOADING...
                            </>
                        ) : (
                            <>
                                <UploadCloud size={23} />
                                UPLOAD FILE
                            </>
                        )}
                    </button>

                    {/* Privacy Note */}
                    <div className="privacy-note">
                        <LockKeyhole size={19} />
                        <span>
                            Your files are used only for printing purposes.
                        </span>
                    </div>

                </form>
            </main>

            <Footer />
        </>
    );
}

export default UploadPage;
