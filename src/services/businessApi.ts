import { apiFetch } from "./apiClient";
import type {
  Business,
  BusinessDetail,
  CreateBusinessRequest,
  UpdateBusinessRequest,
} from "../types/business";

const BASE_URL = "/businesses";

async function readError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data?.message || "Request failed.";
  } catch {
    return await response.text();
  }
}

export async function getBusinesses(): Promise<Business[]> {
  const response = await apiFetch(BASE_URL);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to load businesses.");
  }

  return response.json();
}

export async function getMyBusinesses(): Promise<Business[]> {
  return getBusinesses();
}

export async function getBusiness(id: string): Promise<BusinessDetail> {
  const response = await apiFetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
}

export async function createBusiness(
  request: CreateBusinessRequest
): Promise<{ businessId: string }> {
  const response = await apiFetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
}

export async function updateBusiness(
  id: string,
  request: UpdateBusinessRequest
): Promise<void> {
  const response = await apiFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}

export async function deleteBusiness(id: string): Promise<void> {
  const response = await apiFetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}

export async function setDefaultBusiness(id: string): Promise<void> {
  const response = await apiFetch(`${BASE_URL}/${id}/set-default`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}