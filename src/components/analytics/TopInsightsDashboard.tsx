import { useEffect, useMemo, useState } from "react";
import { getTopInsights } from "../../services/analyticsApi";
import type { Insight, InsightSeverity, TopInsightsResponse } from "../../types/analytics";

type Props = {
  businessId: string;
  monthsBack?: number;
};

export default function TopInsightsDashboard({
  businessId,
  monthsBack = 6,
}: Props) {
  const [data, setData] = useState<TopInsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const result = await getTopInsights(businessId, monthsBack);

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load top insights.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [businessId, monthsBack]);

  const generatedAt = useMemo(() => {
    if (!data?.generatedAtUtc) return null;
    return new Date(data.generatedAtUtc).toLocaleString();
  }, [data]);

  if (loading) {
    return (
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="text-lg font-semibold text-slate-900">Top 5 Insights</div>
        <div className="mt-3 text-sm text-slate-500">Loading insights...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <div className="text-lg font-semibold text-red-700">Top 5 Insights</div>
        <div className="mt-3 text-sm text-red-600">{error}</div>
      </section>
    );
  }

  if (!data || data.insights.length === 0) {
    return (
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="text-lg font-semibold text-slate-900">Top 5 Insights</div>
        <div className="mt-3 text-sm text-slate-500">No insights available yet.</div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Top 5 Insights</h2>
            <p className="mt-1 text-sm text-slate-500">
              Ranked business insights based on recent transaction activity.
            </p>
          </div>

          <div className="text-sm text-slate-500">
            <div>
              <span className="font-medium text-slate-700">Business:</span> {businessId}
            </div>
            <div>
              <span className="font-medium text-slate-700">Lookback:</span> {monthsBack} months
            </div>
            {generatedAt && (
              <div>
                <span className="font-medium text-slate-700">Generated:</span> {generatedAt}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {data.insights.map((insight, index) => (
          <InsightCard key={`${insight.type}-${index}`} insight={insight} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}

function InsightCard({
  insight,
  rank,
}: {
  insight: Insight;
  rank: number;
}) {
  return (
    <article className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {rank}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {formatInsightType(insight.type)}
            </div>
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${severityClass(
            insight.severity
          )}`}
        >
          {insight.severity}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900">{insight.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{insight.message}</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MetricTile
          label="Estimated Impact"
          value={formatCurrency(insight.estimatedImpact, insight.currencyCode)}
        />
        <MetricTile label="Score" value={insight.score.toFixed(2)} />
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <div className="mb-3 text-sm font-semibold text-slate-800">Supporting Metrics</div>

        <div className="space-y-2">
          {Object.entries(insight.metrics).map(([key, value]) => (
            <div
              key={key}
              className="flex items-start justify-between gap-3 border-b border-slate-200 pb-2 text-sm last:border-b-0 last:pb-0"
            >
              <span className="text-slate-500">{humanizeKey(key)}</span>
              <span className="text-right font-medium text-slate-800">
                {formatMetricValue(key, value, insight.currencyCode)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-slate-50 p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-base font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function severityClass(severity: InsightSeverity): string {
  switch (severity) {
    case "High":
      return "bg-red-100 text-red-700";
    case "Medium":
      return "bg-amber-100 text-amber-700";
    case "Low":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatInsightType(type: string): string {
  return type.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function humanizeKey(key: string): string {
  const value = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ");
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatCurrency(amount: number, currencyCode = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatMetricValue(
  key: string,
  value: unknown,
  currencyCode = "USD"
): string {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "number") {
    const lowerKey = key.toLowerCase();

    if (
      lowerKey.includes("amount") ||
      lowerKey.includes("impact") ||
      lowerKey.includes("spend")
    ) {
      return formatCurrency(value, currencyCode);
    }

    if (lowerKey.includes("pct") || lowerKey.includes("percent")) {
      return `${value.toFixed(2)}%`;
    }

    return value.toLocaleString();
  }

  return String(value);
}