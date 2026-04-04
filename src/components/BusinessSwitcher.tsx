import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBusinesses } from "../services/businessApi";
import type { Business } from "../types/business";
import { setCurrentBusiness, getCurrentBusiness } from "../utils/businessSession";

export default function BusinessSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(
    getCurrentBusiness()?.businessId ?? ""
  );

  useEffect(() => {
    async function load() {
      try {
        const data = await getBusinesses();
        setBusinesses(data);

        if (!selectedBusinessId && data.length > 0) {
          const selected = data.find((x) => x.isDefault) ?? data[0];

          setSelectedBusinessId(selected.businessId);
          setCurrentBusiness({
            businessId: selected.businessId,
            businessName: selected.businessName,
          });
        }
      } catch (error) {
        console.error("Failed to load businesses.", error);
      }
    }

    void load();
  }, [selectedBusinessId]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    const selected = businesses.find((x) => x.businessId === id);

    setSelectedBusinessId(id);

    if (!selected) {
      return;
    }

    setCurrentBusiness({
      businessId: selected.businessId,
      businessName: selected.businessName,
    });

    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  }

  if (businesses.length === 0) {
    return null;
  }

  return (
    <select value={selectedBusinessId} onChange={handleChange}>
      {businesses.map((b) => (
        <option key={b.businessId} value={b.businessId}>
          {b.businessName}
        </option>
      ))}
    </select>
  );
}