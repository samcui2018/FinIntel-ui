import type { CSSProperties } from "react";
import type { StoredInsight } from "../types/analytics";
import InsightVisualizationCard from "./InsightVisualizationCard";

type Props = {
  insight: StoredInsight;
};

function getSeverityStyles(severity: string): CSSProperties {
  switch (severity?.toLowerCase()) {
    case "high":
      return {
        backgroundColor: "#fff5f5",
        border: "1px solid #f5c2c7",
        color: "#842029",
      };
    case "medium":
      return {
        backgroundColor: "#fff8e1",
        border: "1px solid #ffecb5",
        color: "#664d03",
      };
    default:
      return {
        backgroundColor: "#f0f9ff",
        border: "1px solid #b6effb",
        color: "#055160",
      };
  }
}

function formatInsightType(value: string): string {
  if (!value) return "Insight";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getInsightTypeLabel(type: string): string {
  switch (type) {
    case "concentration_risk":
      return "Concentration Risk";
    case "duplicate_charge_risk":
      return "Duplicate Charges";
    case "spend_anomaly":
      return "Spend Anomaly";
    case "recurring_spend":
      return "Recurring Spend";
    case "InterchangeOptimization":
      return "Interchange Optimization";
    case "SubscriptionWaste":
      return "Subscription Waste";
    case "CashFlowForecast":
      return "Cash Flow Forecast";
    case "Benchmark":
      return "Benchmark";
    case "Prediction":
      return "Prediction";
    case "transaction_volume_anomaly":
      return "Transaction Volume Anomaly";
    default:
      return formatInsightType(type);
  }
}

export default function InsightCard({ insight }: Props) {
  const severityStyle = getSeverityStyles(insight.severity);

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        background: "#ffffff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
            {getInsightTypeLabel(insight.insightType)}
          </div>
          <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.3 }}>
            {insight.title}
          </h3>
        </div>

        <span
          style={{
            ...severityStyle,
            borderRadius: 999,
            padding: "4px 10px",
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {insight.severity}
        </span>
      </div>

      <div style={{ color: "#374151", lineHeight: 1.5 }}>
        {insight.description}
      </div>
      
      
      {insight.impactLabel && (
        <div
          style={{
            background: "#f9fafb",
            borderRadius: 10,
            padding: "10px 12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
            {insight.insightType === "recurring_spend"
              ? "Estimated Monthly Cost"
              : "Estimated Impact"}
          </div>
          <div style={{ fontWeight: 700 }}>{insight.impactLabel}</div>
        </div>
      )}

      {insight.recommendation && (
        <div
          style={{
            background: "#f8fafc",
            borderLeft: "4px solid #2563eb",
            padding: "10px 12px",
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
            Recommended action
          </div>
          <div style={{ color: "#1f2937" }}>{insight.recommendation}</div>
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
  );
}