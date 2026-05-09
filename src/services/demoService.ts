import { config } from "../config/config";

//const BASE_URL = "http://localhost:5020/api";

export type DemoStartResponse = {
  token: string;
  businessId: string;
  businessName: string;
  expiresAtUtc: string;
  isDemo: boolean;
};

export async function startDemo(): Promise<DemoStartResponse> {
  const response = await fetch(`${config.apiBaseUrl}/demo/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Unable to start demo session.");
  }

  return await response.json();
}