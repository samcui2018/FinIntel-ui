
import type { TopInsightCardModel } from "../types/analytics";
function InsightCard({
  insight,
  rank,
}: {
  insight: TopInsightCardModel;
  rank: number;
}) {
  const severityColor =
    insight.severity === "High"
      ? "#ff4d4f"
      : insight.severity === "Medium"
      ? "#faad14"
      : "#52c41a";

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 10,
        border: "1px solid #eee",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div style={{ fontSize: 12, color: "#999" }}>#{rank}</div>

        <div style={{ fontWeight: 600 }}>{insight.title}</div>

        <div style={{ fontSize: 14, color: "#666" }}>
          {insight.description}
        </div>

        {insight.recommendation && (
          <div style={{ marginTop: 6, fontSize: 13 }}>
            👉 {insight.recommendation}
          </div>
        )}
      </div>

      <div style={{ textAlign: "right" }}>
        <div style={{ color: severityColor, fontWeight: 600 }}>
          {insight.severity}
        </div>

        <div style={{ fontSize: 16 }}>
          ${insight.estimatedImpact?.toLocaleString() ?? "—"}
        </div>
      </div>
    </div>
  );
}