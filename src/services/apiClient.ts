// const BASE_URL = "http://localhost:5020/api";

// export async function apiFetch(
//   path: string,
//   options: RequestInit = {}
// ): Promise<Response> {
//   const token = localStorage.getItem("token");

//   const headers: HeadersInit = {
//     ...(options.headers ?? {}),
//   };

//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   return fetch(`${BASE_URL}${path}`, {
//     ...options,
//     headers,
//   });
// }
const BASE_URL = "http://localhost:5020/api";

function clearAuthState() {
  localStorage.removeItem("token");
  localStorage.removeItem("currentBusinessId");
  localStorage.removeItem("currentBusinessName");
  localStorage.removeItem("currentBusiness");
}

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

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAuthState();
    // 🔥 Add message before redirect
    sessionStorage.setItem(
      "authMessage",
      "Your session has expired. Please log in again."
    );

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }

    throw new Error("Unauthorized");
  }

  return response;
}
