import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { apiFetch } from "../services/apiClient";
import { getCurrentBusiness } from "../utils/businessSession";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const currentBusiness = getCurrentBusiness();
  const businessId = currentBusiness?.businessId;
  const businessName = currentBusiness?.businessName;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!businessId) {
      setError("Please select a business before uploading.");
      return;
    }

    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await apiFetch(`/businesses/${businessId}/uploads`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Upload failed.");
      }

      const result = await response.json();

      setMessage(
        `Upload complete: ${result.rowsPromoted} transactions processed, ${result.insightCount} insights generated.`
      );

      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Upload CSV</h1>
            <p style={styles.subtitle}>
              Upload a transaction file for analysis and insight generation.
            </p>
          </div>
        </div>

        <div style={styles.businessBanner}>
          <div style={styles.businessLabel}>Current business</div>
          <div style={styles.businessValue}>
            {businessName ?? "None selected"}
          </div>
          {!businessName && (
            <div style={styles.helperText}>
              Select a business before uploading a file.
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.uploadBox}>
            <div style={styles.uploadIcon}>📄</div>
            <div style={styles.uploadTitle}>Choose a CSV file</div>
            <div style={styles.uploadText}>
              Upload transaction data in CSV format.
            </div>

            <label htmlFor="file-upload" style={styles.fileLabel}>
              Browse File
            </label>

            <input
              id="file-upload"
              type="file"
              accept=".csv"
              style={styles.hiddenInput}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            <div style={styles.selectedFile}>
              {file ? `Selected: ${file.name}` : "No file selected"}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !businessId}
            style={{
              ...styles.submitButton,
              ...(uploading || !businessId ? styles.submitButtonDisabled : {}),
            }}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {message ? <div style={styles.successBox}>{message}</div> : null}
        {error ? <div style={styles.errorBox}>{error}</div> : null}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    padding: "32px 24px",
    background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
    minHeight: "100vh",
  },
  card: {
    maxWidth: "760px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
    padding: "28px",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  subtitle: {
    margin: "8px 0 0 0",
    color: "#475569",
    fontSize: "0.98rem",
  },
  businessBanner: {
    marginBottom: "24px",
    padding: "16px 18px",
    borderRadius: "14px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  businessLabel: {
    fontSize: "0.85rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "#64748b",
    marginBottom: "6px",
  },
  businessValue: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#0f172a",
  },
  helperText: {
    marginTop: "8px",
    color: "#b45309",
    fontSize: "0.92rem",
  },
  form: {
    display: "grid",
    gap: "18px",
  },
  uploadBox: {
    border: "2px dashed #cbd5e1",
    borderRadius: "16px",
    padding: "32px 24px",
    textAlign: "center",
    backgroundColor: "#f8fafc",
  },
  uploadIcon: {
    fontSize: "2.4rem",
    marginBottom: "10px",
  },
  uploadTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: "6px",
  },
  uploadText: {
    color: "#64748b",
    marginBottom: "18px",
  },
  fileLabel: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 16px",
    borderRadius: "10px",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    fontWeight: 600,
    cursor: "pointer",
  },
  hiddenInput: {
    display: "none",
  },
  selectedFile: {
    marginTop: "14px",
    fontSize: "0.95rem",
    color: "#334155",
    wordBreak: "break-word",
  },
  submitButton: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "0.98rem",
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(37, 99, 235, 0.2)",
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  successBox: {
    marginTop: "18px",
    padding: "12px 14px",
    borderRadius: "10px",
    backgroundColor: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
  },
  errorBox: {
    marginTop: "18px",
    padding: "12px 14px",
    borderRadius: "10px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
  },
};