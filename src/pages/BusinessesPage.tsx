import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteBusiness,
  getBusinesses,
  setDefaultBusiness,
} from "../services/businessApi";
import type { Business } from "../types/business";

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");
      const data = await getBusinesses();
      setBusinesses(data);

      const currentBusinessId = localStorage.getItem("currentBusinessId");

      if (!currentBusinessId && data.length > 0) {
        const defaultBusiness = data.find((x) => x.isDefault) ?? data[0];
        localStorage.setItem("currentBusinessId", defaultBusiness.businessId);
        localStorage.setItem("currentBusinessName", defaultBusiness.businessName);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load businesses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleSetDefault(business: Business) {
    try {
      await setDefaultBusiness(business.businessId);
      localStorage.setItem("currentBusinessId", business.businessId);
      localStorage.setItem("currentBusinessName", business.businessName);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set default business.");
    }
  }

  async function handleDelete(business: Business) {
    const confirmed = window.confirm(`Delete "${business.businessName}"?`);
    if (!confirmed) return;

    try {
      await deleteBusiness(business.businessId);

      const currentBusinessId = localStorage.getItem("currentBusinessId");
      if (currentBusinessId === business.businessId) {
        localStorage.removeItem("currentBusinessId");
        localStorage.removeItem("currentBusinessName");
      }

      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete business.");
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.loading}>Loading businesses...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Businesses</h1>
            <p style={styles.subtitle}>
              Manage your businesses, choose a default, and keep your workspace organized.
            </p>
          </div>

          <Link to="/businesses/new" style={styles.primaryLink}>
            + Add Business
          </Link>
        </div>

        {error ? <div style={styles.errorBox}>{error}</div> : null}

        {businesses.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🏢</div>
            <h2 style={styles.emptyTitle}>No businesses yet</h2>
            <p style={styles.emptyText}>
              Create your first business to start uploading and analyzing financial data.
            </p>
            <Link to="/businesses/new" style={styles.primaryLink}>
              Create your first business
            </Link>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Business</th>
                  <th style={styles.th}>Industry</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Default</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((b) => (
                  <tr key={b.businessId} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.businessCell}>
                        <div style={styles.businessAvatar}>
                          {b.businessName?.charAt(0).toUpperCase() || "B"}
                        </div>
                        <div>
                          <div style={styles.businessName}>{b.businessName}</div>
                          <div style={styles.businessId}>
                            {b.businessId}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={styles.td}>{b.industry || "-"}</td>
                    <td style={styles.td}>{b.roleName}</td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          ...(b.isDefault ? styles.badgeGold : styles.badgeMuted),
                        }}
                      >
                        {b.isDefault ? "Default" : "No"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          ...(b.isActive ? styles.badgeSuccess : styles.badgeInactive),
                        }}
                      >
                        {b.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <Link to={`/businesses/${b.businessId}/edit`} style={styles.linkButton}>
                          Edit
                        </Link>

                        {!b.isDefault && (
                          <button
                            style={styles.secondaryButton}
                            onClick={() => void handleSetDefault(b)}
                          >
                            Set Default
                          </button>
                        )}

                        <button
                          style={styles.deleteButton}
                          onClick={() => void handleDelete(b)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "32px 24px",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
    minHeight: "100vh",
  },
  card: {
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
    padding: "28px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  subtitle: {
    margin: "8px 0 0 0",
    color: "#475569",
    fontSize: "0.98rem",
  },
  primaryLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 16px",
    borderRadius: "10px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 600,
    whiteSpace: "nowrap",
    boxShadow: "0 6px 14px rgba(37, 99, 235, 0.2)",
  },
  errorBox: {
    marginBottom: "18px",
    padding: "12px 14px",
    borderRadius: "10px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
  },
  loading: {
    padding: "24px 0",
    color: "#475569",
    fontSize: "1rem",
  },
  emptyState: {
    textAlign: "center",
    padding: "56px 24px",
    border: "1px dashed #cbd5e1",
    borderRadius: "16px",
    backgroundColor: "#f8fafc",
  },
  emptyIcon: {
    fontSize: "2.5rem",
    marginBottom: "12px",
  },
  emptyTitle: {
    margin: "0 0 8px 0",
    fontSize: "1.4rem",
    color: "#0f172a",
  },
  emptyText: {
    margin: "0 0 20px 0",
    color: "#64748b",
  },
  tableWrapper: {
    overflowX: "auto",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    minWidth: "980px",
    backgroundColor: "#ffffff",
  },
  th: {
    textAlign: "left",
    padding: "14px 16px",
    backgroundColor: "#f8fafc",
    color: "#334155",
    fontSize: "0.88rem",
    fontWeight: 700,
    borderBottom: "1px solid #e2e8f0",
  },
  tr: {
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #e2e8f0",
    verticalAlign: "middle",
    color: "#0f172a",
    fontSize: "0.95rem",
  },
  businessCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  businessAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "999px",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "1rem",
    flexShrink: 0,
  },
  businessName: {
    fontWeight: 600,
    color: "#0f172a",
  },
  businessId: {
    marginTop: "3px",
    fontSize: "0.78rem",
    color: "#64748b",
    wordBreak: "break-all",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  badgeGold: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  badgeMuted: {
    backgroundColor: "#e2e8f0",
    color: "#475569",
  },
  badgeSuccess: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  badgeInactive: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  linkButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 600,
    border: "1px solid #bfdbfe",
  },
  secondaryButton: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#334155",
    fontWeight: 600,
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #fecaca",
    backgroundColor: "#fff1f2",
    color: "#b91c1c",
    fontWeight: 600,
    cursor: "pointer",
  },
};