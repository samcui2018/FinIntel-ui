import type { Insight } from "../types/analytics";
import InsightCard from "./InsightCard";

type Props = {
  insights: Insight[];
  loading?: boolean;
  error?: string | null;
};

function sortInsights(insights: Insight[]): Insight[] {
  const severityRank: Record<string, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...insights].sort((a, b) => {
    const severityDiff =
      (severityRank[b.severity?.toLowerCase()] ?? 0) -
      (severityRank[a.severity?.toLowerCase()] ?? 0);

    if (severityDiff !== 0) return severityDiff;

    return new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime();
  });
}

export default function InsightsSection({ insights, loading = false, error = null }: Props) {
  const sortedInsights = sortInsights(insights);

  return (
    <section style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>Key Insights</h2>
        <p style={{ margin: "6px 0 0 0", color: "#6b7280" }}>
          Decision-oriented signals generated from uploaded transaction activity.
        </p>
      </div>

      {loading && (
        <div
          style={{
            padding: 16,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "#fff",
          }}
        >
          Loading insights...
        </div>
      )}

      {!loading && error && (
        <div
          style={{
            padding: 16,
            border: "1px solid #fecaca",
            borderRadius: 12,
            background: "#fef2f2",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && sortedInsights.length === 0 && (
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
      )}

      {!loading && !error && sortedInsights.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          {sortedInsights.map((insight) => (
            <InsightCard key={insight.insightId} insight={insight} />
          ))}
        </div>
      )}
    </section>
  );
}