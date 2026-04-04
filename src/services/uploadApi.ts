import { apiFetch } from "./apiClient";
import type { UploadResponse } from "../types/upload";

export async function uploadCsv(
  file: File,
  businessId: string
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("businessId", businessId);

  const response = await apiFetch("/uploads/csv", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Upload error:", text);
    throw new Error(text || "Upload failed.");
  }

  return response.json();
}