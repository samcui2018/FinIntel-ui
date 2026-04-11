import { useEffect, useState } from "react";
import { getTopInsights } from "../services/analyticsApi";
import type { TopInsightCardModel } from "../types/analytics";
// import InsightVisualizationCard from "./InsightVisualizationCard";
// import TopInsightsDashboard from "./analytics/TopInsightsDashboard";
import FeaturedInsight from "./FeaturedInsight";
import StandardInsightCard from "./StandardInsight";

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
            description: insight.description,
            severity: insight.severity,
            estimatedImpact: insight.estimatedImpact,
            recommendation: insight.recommendation,
            score: insight.score,
            visualizationType: insight.visualizationType,
            visualization: insight.visualization,
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

      <div style={{ display: "grid", gap: 16 }}>
        <FeaturedInsight insight={insights[0]} />
      </div>

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