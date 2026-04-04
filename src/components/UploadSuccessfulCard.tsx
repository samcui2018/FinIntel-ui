type Props = {
  loadId: string;
  rows: number;
  insights: number;
};

export default function UploadSuccessCard({ loadId, rows, insights }: Props) {
  return (
    <div
      style={{
        border: "1px solid #d1fae5",
        backgroundColor: "#ecfdf5",
        borderRadius: "12px",
        padding: "20px",
        marginTop: "20px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginBottom: "12px", color: "#065f46" }}>
        ✅ Upload Complete
      </h3>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <Stat label="Transactions" value={rows} />
        <Stat label="Insights Generated" value={insights} />
      </div>

      <div style={{ marginTop: "12px", fontSize: "12px", color: "#6b7280" }}>
        Load ID: {loadId}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div style={{ fontSize: "22px", fontWeight: "bold" }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#6b7280" }}>{label}</div>
    </div>
  );
}