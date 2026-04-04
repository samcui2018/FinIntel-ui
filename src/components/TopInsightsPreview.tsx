import type { Insight } from "../types/analytics";

type Props = {
  insights: Insight[];
};

export default function TopInsightsPreview({ insights }: Props) {
  const items = [...insights].slice(0, 3);

  return (
    <section style={{ marginTop: 24 }}>
      <h2 style={{ marginBottom: 12 }}>Top Insights</h2>

      {items.length === 0 ? (
        <div
          style={{
            padding: 16,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "#fff",
          }}
        >
          No insights available yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((insight) => (
            <div
              key={insight.insightId}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 14,
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: 700 }}>{insight.title}</div>
              <div style={{ color: "#4b5563", marginTop: 6 }}>
                {insight.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}