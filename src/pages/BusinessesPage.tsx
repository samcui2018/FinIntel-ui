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
        const defaultBusiness = data.find(x => x.isDefault) ?? data[0];
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
    load();
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

  if (loading) return <div>Loading businesses...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h1>Businesses</h1>
        <Link to="/businesses/new">Add Business</Link>
      </div>

      {error ? <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div> : null}

      {businesses.length === 0 ? (
        <div>
          <p>No businesses yet.</p>
          <Link to="/businesses/new">Create your first business</Link>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">Business</th>
              <th align="left">Industry</th>
              <th align="left">Role</th>
              <th align="left">Default</th>
              <th align="left">Status</th>
              <th align="left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map(b => (
              <tr key={b.businessId}>
                <td>{b.businessName}</td>
                <td>{b.industry || "-"}</td>
                <td>{b.roleName}</td>
                <td>{b.isDefault ? "Yes" : "No"}</td>
                <td>{b.isActive ? "Active" : "Inactive"}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <Link to={`/businesses/${b.businessId}/edit`}>Edit</Link>
                  {!b.isDefault && (
                    <button onClick={() => void handleSetDefault(b)}>
                      Set Default
                    </button>
                  )}
                  <button onClick={() => void handleDelete(b)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}