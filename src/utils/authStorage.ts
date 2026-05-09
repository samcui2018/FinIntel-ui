export function saveAuthSession(data: {
  token: string;
  businessId: string;
  businessName: string;
  isDemo?: boolean;
  expiresAtUtc?: string;
}) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("currentBusinessId", data.businessId);
  localStorage.setItem("currentBusinessName", data.businessName);

  if (data.isDemo) {
    localStorage.setItem("isDemo", "true");
  } else {
    localStorage.removeItem("isDemo");
  }

  if (data.expiresAtUtc) {
    localStorage.setItem("demoExpiresAtUtc", data.expiresAtUtc);
  } else {
    localStorage.removeItem("demoExpiresAtUtc");
  }
}

export function clearAuthSession(message?: string) {
  localStorage.removeItem("token");
  localStorage.removeItem("currentBusinessId");
  localStorage.removeItem("currentBusinessName");
  localStorage.removeItem("isDemo");
  localStorage.removeItem("demoExpiresAtUtc");

  if (message) {
    localStorage.setItem("authMessage", message);
  } else {
    localStorage.removeItem("authMessage");
  }
}