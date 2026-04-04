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

//   // return fetch(`${BASE_URL}${path}`, {
//   //   ...options,
//   //   headers,
//   // });
//     const response = await fetch(`${BASE_URL}${path}`, {
//     ...options,
//     headers,
//   });

//     if (response.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("userEmail");
//       localStorage.removeItem("userRole");
//       localStorage.removeItem("businessId");
//       //window.location.href = "/login";
//       console.warn("401 from API:", path);
//     }
//   return response;
// }