const BASE_URL = "http://localhost:5020/api";

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

  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
}
