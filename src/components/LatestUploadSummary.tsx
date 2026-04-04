import type { UploadHistoryItem } from "../types/analytics";

type Props = {
  item: UploadHistoryItem | null;
};

export default function LatestUploadSummary({ item }: Props) {
  if (!item) return null;

  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        backgroundColor: "#ffffff",
        marginBottom: 20,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 18 }}>
        Latest Upload
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        <SummaryItem label="File Name" value={item.sourceName || "—"} />
        <SummaryItem label="Status" value={item.status || "—"} />
        <SummaryItem label="Rows in File" value={String(item.rowsInFile)} />
        <SummaryItem
          label="Rows Inserted"
          value={item.rowsInserted != null ? String(item.rowsInserted) : "—"}
        />
        <SummaryItem
          label="Uploaded At"
          value={new Date(item.createdAt).toLocaleString()}
        />
      </div>
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, wordBreak: "break-word" }}>
        {value}
      </div>
    </div>
  );
}