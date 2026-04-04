import { useState } from "react";
import type { CreateBusinessRequest } from "../types/business";

type Props = {
  initialValue?: CreateBusinessRequest;
  submitText: string;
  onSubmit: (value: CreateBusinessRequest) => Promise<void>;
};

export default function BusinessForm({ initialValue, submitText, onSubmit }: Props) {
  const [form, setForm] = useState<CreateBusinessRequest>({
    businessName: initialValue?.businessName ?? "",
    legalName: initialValue?.legalName ?? "",
    industry: initialValue?.industry ?? "",
    website: initialValue?.website ?? "",
    phone: initialValue?.phone ?? "",
    taxId: initialValue?.taxId ?? "",
    addressLine1: initialValue?.addressLine1 ?? "",
    addressLine2: initialValue?.addressLine2 ?? "",
    city: initialValue?.city ?? "",
    stateProvince: initialValue?.stateProvince ?? "",
    postalCode: initialValue?.postalCode ?? "",
    country: initialValue?.country ?? "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update<K extends keyof CreateBusinessRequest>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.businessName.trim()) {
      setError("Business name is required.");
      return;
    }

    try {
      setSaving(true);
      await onSubmit({
        ...form,
        businessName: form.businessName.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save business.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={pageWrapStyle}>
      <form onSubmit={handleSubmit} style={formCardStyle}>
        <div style={headerStyle}>
          <div style={badgeStyle}>Business Setup</div>
          <h2 style={titleStyle}>Business Information</h2>
          <p style={subtitleStyle}>
            Add the core details for your business. You can update this information later.
          </p>
        </div>

        <div style={sectionStyle}>
          <div style={fieldStyle}>
            <label htmlFor="businessName" style={labelStyle}>
              Business Name <span style={requiredStyle}>*</span>
            </label>
            <input
              id="businessName"
              value={form.businessName}
              onChange={(e) => update("businessName", e.target.value)}
              placeholder="Acme Coffee"
              style={inputStyle}
            />
          </div>

          <div style={twoColumnGridStyle}>
            <div style={fieldStyle}>
              <label htmlFor="legalName" style={labelStyle}>
                Legal Name
              </label>
              <input
                id="legalName"
                value={form.legalName ?? ""}
                onChange={(e) => update("legalName", e.target.value)}
                placeholder="Acme Coffee LLC"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="industry" style={labelStyle}>
                Industry
              </label>
              <input
                id="industry"
                value={form.industry ?? ""}
                onChange={(e) => update("industry", e.target.value)}
                placeholder="Retail, Restaurant, Services"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={twoColumnGridStyle}>
            <div style={fieldStyle}>
              <label htmlFor="website" style={labelStyle}>
                Website
              </label>
              <input
                id="website"
                value={form.website ?? ""}
                onChange={(e) => update("website", e.target.value)}
                placeholder="https://yourbusiness.com"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="phone" style={labelStyle}>
                Phone
              </label>
              <input
                id="phone"
                value={form.phone ?? ""}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="(555) 123-4567"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label htmlFor="taxId" style={labelStyle}>
              Tax ID
            </label>
            <input
              id="taxId"
              value={form.taxId ?? ""}
              onChange={(e) => update("taxId", e.target.value)}
              placeholder="XX-XXXXXXX"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={sectionDividerStyle} />

        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Business Address</h3>

          <div style={fieldStyle}>
            <label htmlFor="addressLine1" style={labelStyle}>
              Address Line 1
            </label>
            <input
              id="addressLine1"
              value={form.addressLine1 ?? ""}
              onChange={(e) => update("addressLine1", e.target.value)}
              placeholder="123 Main Street"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="addressLine2" style={labelStyle}>
              Address Line 2
            </label>
            <input
              id="addressLine2"
              value={form.addressLine2 ?? ""}
              onChange={(e) => update("addressLine2", e.target.value)}
              placeholder="Suite 200"
              style={inputStyle}
            />
          </div>

          <div style={threeColumnGridStyle}>
            <div style={fieldStyle}>
              <label htmlFor="city" style={labelStyle}>
                City
              </label>
              <input
                id="city"
                value={form.city ?? ""}
                onChange={(e) => update("city", e.target.value)}
                placeholder="Knoxville"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="stateProvince" style={labelStyle}>
                State / Province
              </label>
              <input
                id="stateProvince"
                value={form.stateProvince ?? ""}
                onChange={(e) => update("stateProvince", e.target.value)}
                placeholder="TN"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="postalCode" style={labelStyle}>
                Postal Code
              </label>
              <input
                id="postalCode"
                value={form.postalCode ?? ""}
                onChange={(e) => update("postalCode", e.target.value)}
                placeholder="37919"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label htmlFor="country" style={labelStyle}>
              Country
            </label>
            <input
              id="country"
              value={form.country ?? ""}
              onChange={(e) => update("country", e.target.value)}
              placeholder="United States"
              style={inputStyle}
            />
          </div>
        </div>

        {error ? <div style={errorStyle}>{error}</div> : null}

        <div style={buttonRowStyle}>
          <button type="submit" disabled={saving} style={buttonStyle}>
            {saving ? "Saving..." : submitText}
          </button>
        </div>
      </form>
    </div>
  );
}

const pageWrapStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  padding: "24px 16px",
};

const formCardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 880,
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 20,
  padding: 32,
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
  display: "grid",
  gap: 24,
};

const headerStyle: React.CSSProperties = {
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
  fontSize: 30,
  fontWeight: 700,
  color: "#111827",
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.6,
  color: "#6b7280",
};

const sectionStyle: React.CSSProperties = {
  display: "grid",
  gap: 18,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 700,
  color: "#111827",
};

const sectionDividerStyle: React.CSSProperties = {
  height: 1,
  background: "#e5e7eb",
};

const fieldStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "#374151",
};

const requiredStyle: React.CSSProperties = {
  color: "#dc2626",
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

const twoColumnGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 16,
};

const threeColumnGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 16,
};

const errorStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#b91c1c",
  fontSize: 14,
};

const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
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
  minWidth: 160,
};