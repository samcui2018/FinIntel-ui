import { useEffect, useState } from "react";
import { getTopInsights } from "../services/analyticsApi";
import type { TopInsightCardModel } from "../types/analytics";

export default function TopInsightsPanel() {
  const [insights, setInsights] = useState<TopInsightCardModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTopInsights();

        const mapped: TopInsightCardModel[] = data.insights
          .slice(0, 5)
          .map((insight, index) => ({
            id: `${insight.type}-${index}`,
            title: insight.title,
            description: insight.message,
            severity: insight.severity,
            estimatedImpact: insight.estimatedImpact,
            recommendation: null,
            score: insight.score,
          }));

        setInsights(mapped);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: 16,
          padding: 20,
          backgroundColor: "#fff",
        }}
      >
        <h2 style={{ margin: 0 }}>Top 5 Opportunities</h2>
        <p style={{ marginTop: 8, color: "#666" }}>Loading insights...</p>
      </section>
    );
  }

  if (!insights.length) {
    return (
      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: 16,
          padding: 20,
          backgroundColor: "#fff",
        }}
      >
        <h2 style={{ margin: 0 }}>Top 5 Opportunities</h2>
        <p style={{ marginTop: 8, color: "#666" }}>
          No top opportunities available yet.
        </p>
      </section>
    );
  }

  const totalImpact = insights.reduce(
    (sum, i) => sum + (i.estimatedImpact ?? 0),
    0
  );

  return (
    <section
      style={{
        border: "1px solid #ddd",
        borderRadius: 16,
        padding: 20,
        backgroundColor: "#fff",
        display: "grid",
        gap: 16,
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>Top 5 Opportunities</h2>
        <p style={{ margin: "6px 0 0", color: "#666" }}>
          Actions you can take right now to improve your business.
        </p>
        <p style={{ margin: "8px 0 0", color: "#111", fontWeight: 600 }}>
          Potential impact: ${totalImpact.toLocaleString()}
        </p>
      </div>

      <FeaturedInsight insight={insights[0]} />

      <div style={{ display: "grid", gap: 12 }}>
        {insights.slice(1).map((insight, index) => (
          <StandardInsightCard
            key={insight.id}
            insight={insight}
            rank={index + 2}
          />
        ))}
      </div>
    </section>
  );
}

function FeaturedInsight({ insight }: { insight: TopInsightCardModel }) {
  const priority = getPriorityBadge(insight.score);

  return (
    <div
      style={{
        padding: 20,
        borderRadius: 16,
        background: "#111",
        color: "#fff",
        boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.7, letterSpacing: 1 }}>
        TOP OPPORTUNITY
      </div>

      <div style={{ marginTop: 10 }}>
        <span
          style={{
            display: "inline-block",
            padding: "6px 10px",
            borderRadius: 999,
            background: priority.background,
            color: priority.color,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {priority.label}
        </span>
      </div>

      <h3 style={{ margin: "12px 0 8px", fontSize: 24 }}>{insight.title}</h3>

      <p style={{ margin: 0, opacity: 0.9, lineHeight: 1.6 }}>
        {insight.description}
      </p>

      <div style={{ marginTop: 18, fontSize: 28, fontWeight: 700 }}>
        ${insight.estimatedImpact?.toLocaleString() ?? "—"}
      </div>

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        <InfoBlock label="Severity" value={insight.severity} dark />
        <InfoBlock
          label="Priority"
          value={priority.label}
          dark
        />
      </div>

      {insight.recommendation && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 10,
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>
            Recommended Action
          </div>
          <div>{insight.recommendation}</div>
        </div>
      )}
    </div>
  );
}

function StandardInsightCard({
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

function InfoBlock({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 10,
        background: dark ? "rgba(255,255,255,0.08)" : "#f9fafb",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: dark ? "rgba(255,255,255,0.7)" : "#6b7280",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function getPriorityBadge(score?: number | null) {
  const value = score ?? 0;

  if (value >= 320) {
    return {
      label: "Critical",
      background: "#7f1d1d",
      color: "#ffffff",
    };
  }

  if (value >= 300) {
    return {
      label: "High Priority",
      background: "#fee2e2",
      color: "#991b1b",
    };
  }

  if (value >= 220) {
    return {
      label: "Medium Priority",
      background: "#fef3c7",
      color: "#92400e",
    };
  }

  return {
    label: "Low Priority",
    background: "#dbeafe",
    color: "#1d4ed8",
  };
}

function getSeverityPillStyle(severity: string): React.CSSProperties {
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