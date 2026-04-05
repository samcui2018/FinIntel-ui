import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBusinesses } from "../services/businessApi";
import type { Business } from "../types/business";
import {
  setCurrentBusiness,
  getCurrentBusiness,
} from "../utils/businessSession";

export default function BusinessSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(
    getCurrentBusiness()?.businessId ?? ""
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBusinesses();
        setBusinesses(data);

        if (!data.length) {
          return;
        }

        const current = getCurrentBusiness();
        const existingSelection =
          data.find((x) => x.businessId === current?.businessId) ??
          data.find((x) => x.businessId === selectedBusinessId);

        const selected = existingSelection ?? data.find((x) => x.isDefault) ?? data[0];

        setSelectedBusinessId(selected.businessId);

        setCurrentBusiness({
          businessId: selected.businessId,
          businessName: selected.businessName,
        });
      } catch (error) {
        console.error("Failed to load businesses.", error);
      }
    }

    void load();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) {
        return;
      }

      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSelect(business: Business) {
    setSelectedBusinessId(business.businessId);
    setCurrentBusiness({
      businessId: business.businessId,
      businessName: business.businessName,
    });
    setIsOpen(false);

    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  }

  const selectedBusiness =
    businesses.find((x) => x.businessId === selectedBusinessId) ?? null;

  if (businesses.length === 0) {
    return null;
  }

  return (
    <div ref={wrapperRef} style={styles.wrapper}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          ...styles.trigger,
          ...(isOpen ? styles.triggerOpen : {}),
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div style={styles.triggerContent}>
          <div style={styles.triggerLabel}>Business</div>
          <div style={styles.triggerValueRow}>
            <span style={styles.triggerValue}>
              {selectedBusiness?.businessName ?? "Select business"}
            </span>

            {selectedBusiness?.isDefault ? (
              <span style={{ ...styles.badge, ...styles.defaultBadge }}>
                Default
              </span>
            ) : null}
          </div>
        </div>

        <span style={{ ...styles.chevron, ...(isOpen ? styles.chevronOpen : {}) }}>
          ▾
        </span>
      </button>

      {isOpen ? (
        <div style={styles.menu} role="listbox" aria-label="Select business">
          {businesses.map((business) => {
            const isSelected = business.businessId === selectedBusinessId;

            return (
              <button
                key={business.businessId}
                type="button"
                onClick={() => handleSelect(business)}
                style={{
                  ...styles.option,
                  ...(isSelected ? styles.optionSelected : {}),
                }}
              >
                <div style={styles.optionMain}>
                  <div style={styles.optionTopRow}>
                    <span style={styles.optionName}>{business.businessName}</span>

                    <div style={styles.badgeGroup}>
                      {business.isDefault ? (
                        <span style={{ ...styles.badge, ...styles.defaultBadge }}>
                          Default
                        </span>
                      ) : null}

                      <span
                        style={{
                          ...styles.badge,
                          ...(business.isActive
                            ? styles.activeBadge
                            : styles.inactiveBadge),
                        }}
                      >
                        {business.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div style={styles.optionMetaRow}>
                    <span style={styles.optionMeta}>{business.industry || "No industry"}</span>
                    <span style={styles.metaDot}>•</span>
                    <span style={styles.optionMeta}>{business.roleName}</span>
                  </div>
                </div>

                {isSelected ? <span style={styles.checkmark}>✓</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    position: "relative",
    minWidth: "300px",
  },
  trigger: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "12px 14px",
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "14px",
    cursor: "pointer",
    textAlign: "left",
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)",
    transition: "all 0.15s ease",
  },
  triggerOpen: {
    border: "1px solid #93c5fd",
    boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.12)",
  },
  triggerContent: {
    minWidth: 0,
    flex: 1,
  },
  triggerLabel: {
    fontSize: "0.72rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#64748b",
    marginBottom: "4px",
  },
  triggerValueRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  triggerValue: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#0f172a",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "200px",
  },
  chevron: {
    color: "#64748b",
    fontSize: "0.9rem",
    transition: "transform 0.15s ease",
    flexShrink: 0,
  },
  chevronOpen: {
    transform: "rotate(180deg)",
  },
  menu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    width: "100%",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.14)",
    padding: "8px",
    zIndex: 200,
    maxHeight: "360px",
    overflowY: "auto",
  },
  option: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    textAlign: "left",
    padding: "12px 12px",
    border: "1px solid transparent",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    cursor: "pointer",
    marginBottom: "4px",
  },
  optionSelected: {
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
  },
  optionMain: {
    minWidth: 0,
    flex: 1,
  },
  optionTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "4px",
  },
  optionName: {
    fontSize: "0.97rem",
    fontWeight: 700,
    color: "#0f172a",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  optionMetaRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "wrap",
  },
  optionMeta: {
    fontSize: "0.83rem",
    color: "#64748b",
  },
  metaDot: {
    fontSize: "0.8rem",
    color: "#94a3b8",
  },
  badgeGroup: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "wrap",
    flexShrink: 0,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 8px",
    borderRadius: "999px",
    fontSize: "0.72rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  defaultBadge: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  activeBadge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  inactiveBadge: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  checkmark: {
    color: "#2563eb",
    fontWeight: 800,
    fontSize: "1rem",
    flexShrink: 0,
  },
};