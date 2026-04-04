import { useState } from "react";
import { apiFetch } from "../services/apiClient";
import { getCurrentBusiness } from "../utils/businessSession";
//import UploadSuccessCard from "../components/UploadSuccessfulCard";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const currentBusiness = getCurrentBusiness();
  const businessId = currentBusiness?.businessId;
  const businessName = currentBusiness?.businessName;

async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    try 
    {
        setUploading(true);
        const businessId = localStorage.getItem("currentBusinessId");

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
          `Upload complete: ${result.rowsPromoted} transactions processed, ` +
          `${result.insightCount} insights generated.`
        );
        //setMessage(`Upload succeeded. LoadId: ${result.loadId}, inserted: ${result.rowsPromoted}, insights generated: ${result.insightCount}`);
        setFile(null);
    } 
    catch (err) 
    {
        setError(err instanceof Error ? err.message : "Upload failed.");
    } 
    finally 
    {
        setUploading(false);
    }
  }

  return (
    <div>
      <h1>Upload CSV</h1>
      <p>
        Current business: <strong>{businessName ?? "None selected"}</strong>
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        <input
          type="file"
          accept=".csv"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
        />

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {message ? <div style={{ color: "green", marginTop: 12 }}>{message}</div> : null}
      {error ? <div style={{ color: "crimson", marginTop: 12 }}>{error}</div> : null}
    </div>
  );
}