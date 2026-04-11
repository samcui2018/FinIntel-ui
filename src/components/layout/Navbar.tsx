import { Link, useNavigate, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";
import BusinessSwitcher from "../BusinessSwitcher";
import { clearCurrentBusiness } from "../../utils/businessSession";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = localStorage.getItem("userEmail");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    clearCurrentBusiness();
    navigate("/login");
  }

  function isActive(path: string) {
    return location.pathname === path;
  }

  return (
    <nav style={styles.nav}>
      {/* Left side */}
      <div style={styles.left}>
        <div style={styles.logo}>FinIntel</div>

        <div style={styles.links}>
          <Link to="/" style={linkStyle(isActive("/"))}>
            Dashboard
          </Link>
          <Link to="/upload" style={linkStyle(isActive("/upload"))}>
            Upload
          </Link>
          <Link to="/analytics" style={linkStyle(isActive("/analytics"))}>
            Analytics
          </Link>
          <Link to="/businesses" style={linkStyle(isActive("/businesses"))}>
            Businesses
          </Link>
          <Link to="/ai-chat" style={linkStyle(isActive("/ai-chat"))}>
            AI Chat
          </Link>
        </div>

        <div style={styles.switcher}>
          <BusinessSwitcher />
        </div>
      </div>

      {/* Right side */}
      <div style={styles.right}>
        <div style={styles.userBox}>
          <div style={styles.avatar}>
            {email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div style={styles.email}>{email}</div>
        </div>

        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

/* ---------------- STYLES ---------------- */

const styles: Record<string, CSSProperties> = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    padding: "14px 24px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  logo: {
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#2563eb",
    letterSpacing: "0.3px",
  },
  links: {
    display: "flex",
    gap: "12px",
  },
  switcher: {
    marginLeft: "12px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f8fafc",
    padding: "6px 10px",
    borderRadius: "999px",
    border: "1px solid #e2e8f0",
  },
  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "999px",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "0.9rem",
  },
  email: {
    fontSize: "0.9rem",
    color: "#334155",
  },
  logoutButton: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #fecaca",
    backgroundColor: "#fff1f2",
    color: "#b91c1c",
    fontWeight: 600,
    cursor: "pointer",
  },
};

function linkStyle(active: boolean): CSSProperties {
  return {
    padding: "8px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.92rem",
    color: active ? "#1d4ed8" : "#334155",
    backgroundColor: active ? "#eff6ff" : "transparent",
    border: active ? "1px solid #bfdbfe" : "1px solid transparent",
  };
}