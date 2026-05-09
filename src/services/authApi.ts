// import { apiFetch } from "./apiClient";
// import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";
// import type { LoginResponse } from "../types/auth";
import { config } from "../config/config";

//const BASE_URL = "http://localhost:5020/api";

async function readError(response: Response): Promise<string> {
  const text = await response.text();

  if (!text) {
    return "Request failed.";
  }

  try {
    const data = JSON.parse(text);
    return data?.message || text;
  } catch {
    return text;
  }
}

export async function login(email: string, password: string) {
  const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
}

export async function register(request: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
}

// export async function login(email: string, password: string): Promise<LoginResponse> {
//   const response = await fetch(`${BASE_URL}/auth/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       email,
//       password,
//     }),
//   });

//   const raw = await response.text();
//   console.log("login status:", response.status);
//   console.log("login response:", raw);

//   if (!response.ok) {
//     throw new Error(`Login failed: ${raw}`);
//   }

//   return JSON.parse(raw) as LoginResponse;
// }

// export async function register(request: RegisterRequest): Promise<AuthResponse> {
//   const response = await apiFetch("/auth/register", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(request),
//   });

//   if (!response.ok) {
//     const text = await response.text();
//     throw new Error(text || "Registration failed.");
//   }

//   return response.json();
// }

