import { clearAuthSession } from "../utils/authStorage";
import { config } from "../config/config";

//const BASE_URL = "http://localhost:5020/api";

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    ...(options.headers ?? {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // const response = await fetch(`${BASE_URL}${path}`, {
  //   ...options,
  //   headers,
  // });
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAuthSession("Your session expired. Please log in again.");

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  return response;
}

