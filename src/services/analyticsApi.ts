import { apiFetch } from "./apiClient";
import type {
  AnalyticsSummary,
  MonthlyTrendPoint,
  TopMerchant,
  UploadHistoryItem,
  TopInsightsResponse,
  TopInsight,
  StoredInsight,
} from "../types/analytics";

import { getCurrentBusiness} from "../utils/businessSession";

async function readJsonOrThrow<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || fallbackMessage);
  }

  return response.json() as Promise<T>;
}

export async function getAnalyticsSummary() {
  const businessId = getCurrentBusiness()?.businessId;

  if (!businessId) {
    throw new Error("No business selected.");
  }

  const response = await apiFetch(
    `/businesses/${businessId}/analytics/summary`
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to load analytics.");
  }

  return response.json();
}

export async function getMonthlyTrend(
) {
  const businessId = getCurrentBusiness()?.businessId;

  if (!businessId) {
    throw new Error("No business selected.");
  }
  const response = await apiFetch(
   `/businesses/${businessId}/analytics/monthly-trend`
  );

  return readJsonOrThrow<MonthlyTrendPoint[]>(
    response,
    "Failed to load monthly trend."
  );
}

export async function getTopMerchants(
) {
  const businessId = getCurrentBusiness()?.businessId;

  if (!businessId) {
    throw new Error("No business selected.");
  }

  const response = await apiFetch(
    `/businesses/${businessId}/analytics/top-merchants?limit=10`
  );

  return readJsonOrThrow<TopMerchant[]>(
    response,
    "Failed to load top merchants."
  );
}

export async function getUploadHistory() {
  const businessId = getCurrentBusiness()?.businessId;

  if (!businessId) {
    throw new Error("No business selected.");
  }

  const response = await apiFetch(`/businesses/${businessId}/analytics/upload-history`);

  return readJsonOrThrow<UploadHistoryItem[]>(
    response,
    "Failed to load upload history."
  );
}

export async function getTopInsights(
){
  const businessId = getCurrentBusiness()?.businessId;

  if (!businessId) {
    throw new Error("No business selected.");
  }

  const response = await apiFetch(
    `/businesses/${businessId}/analytics/top-insights`
  );

  return readJsonOrThrow<TopInsightsResponse>(
    response,
    "Failed to load top insights."
  );
}

export interface BusinessIntelligenceResponse {
  businessId: string;
  executiveSummary: string;
  insights: StoredInsight[];
  benchmark: any;
  forecast: any;
}

export async function getBusinessIntelligence(
  businessId: string
): Promise<BusinessIntelligenceResponse> {
  const response = await apiFetch(
    `/businesses/${businessId}/intelligence`
  );

  if (!response.ok) {
    throw new Error("Failed to load intelligence");
  }

  return response.json();
}