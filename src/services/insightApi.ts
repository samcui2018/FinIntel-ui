import { apiFetch } from "./apiClient";
import type { Insight } from "../types/analytics";

export async function getInsightsByBusinessId(businessId: string): Promise<Insight[]> {
  const response = await apiFetch(`/insights/business/${businessId}`);

  if (!response.ok) {
    throw new Error(`Failed to load insights: ${response.status}`);
  }

  return response.json();
}

export async function getInsightsByLoadId(loadId: string): Promise<Insight[]> {
  const response = await apiFetch(`/insights/load/${loadId}`);

  if (!response.ok) {
    throw new Error(`Failed to load insights: ${response.status}`);
  }

  return response.json();
}