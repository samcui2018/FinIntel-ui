import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authApi";
import { postAuthNavigation } from "../utils/postAuthNavigation";
import { clearCurrentBusiness } from "../utils/businessSession";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const authMessage = sessionStorage.getItem("authMessage");
    if (authMessage) {
      setError(authMessage);
      sessionStorage.removeItem("authMessage");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      setSaving(true);

      const result = await login(email.trim(), password);

      // store auth
      localStorage.setItem("token", result.token);
      localStorage.setItem("userEmail", result.email ?? email.trim());
      localStorage.setItem("userRole", result.role ?? "");

      // decide where to go (business-aware)
      await postAuthNavigation(navigate);
    } catch (err) {
      clearCurrentBusiness();
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={heroStyle}>
          <div style={badgeStyle}>FinIntel</div>
          <h1 style={titleStyle}>Welcome back</h1>
          <p style={subtitleStyle}>
            Sign in to manage your businesses, uploads, and analytics dashboards.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <div style={passwordHeaderStyle}>
              <label htmlFor="password" style={labelStyle}>
                Password
              </label>
            </div>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              style={inputStyle}
            />
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <button type="submit" disabled={saving} style={buttonStyle}>
            {saving ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={footerStyle}>
          <span style={{ color: "#6b7280" }}>Don’t have an account?</span>{" "}
          <Link to="/register" style={linkStyle}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "calc(100vh - 80px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px 16px",
  background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 460,
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 20,
  padding: 32,
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.10)",
  display: "grid",
  gap: 24,
};

const heroStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  width: "fit-content",
  padding: "6px 10px",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#1d4ed8",
  fontSize: 12,
  fontWeight: 700,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 32,
  fontWeight: 700,
  color: "#111827",
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.6,
  color: "#6b7280",
};

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: 18,
};

const fieldStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
};

const passwordHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "#374151",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  fontSize: 15,
  color: "#111827",
  background: "#ffffff",
  outline: "none",
};

const errorStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#b91c1c",
  fontSize: 14,
};

const buttonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 12,
  padding: "13px 20px",
  background: "#2563eb",
  color: "#ffffff",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  width: "100%",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  fontSize: 14,
};

const linkStyle: React.CSSProperties = {
  color: "#2563eb",
  fontWeight: 600,
  textDecoration: "none",
};