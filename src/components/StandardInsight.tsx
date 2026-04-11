
import type { TopInsightCardModel } from "../types/analytics";
import InsightVisualizationCard from "./InsightVisualizationCard";
import { getPriorityBadge, getSeverityPillStyle } from "../utils/SharedFunctions";
export default function StandardInsightCard({
  insight,
  rank,
}: {
  insight: TopInsightCardModel;
  rank: number;
}) {
  const priority = getPriorityBadge(insight.score);
  const severityStyle = getSeverityPillStyle(insight.severity);

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>
          #{rank}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 8px",
              borderRadius: 999,
              background: priority.background,
              color: priority.color,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {priority.label}
          </span>

          <span
            style={{
              ...severityStyle,
              display: "inline-block",
              padding: "4px 8px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {insight.severity}
          </span>
        </div>

        <div style={{ fontWeight: 700, marginBottom: 6 }}>{insight.title}</div>

        <div style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.5 }}>
          {insight.description}
        </div>

        {insight.recommendation && (
          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              borderRadius: 8,
              background: "#f8fafc",
              borderLeft: "4px solid #2563eb",
              fontSize: 13,
              color: "#1f2937",
            }}
          >
            <strong>Recommended:</strong> {insight.recommendation}
          </div>
        )}
          {insight.visualization && (
            <div style={{ marginTop: 20 }}>
              <InsightVisualizationCard
                visualization={insight.visualization}
              />
            </div>
          )}
      </div>

      <div style={{ textAlign: "right", minWidth: 110 }}>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
          Impact
        </div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          ${insight.estimatedImpact?.toLocaleString() ?? "—"}
        </div>
      </div>
    </div>
  );
}


