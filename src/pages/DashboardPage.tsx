import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAnalyticsSummary,
  getMonthlyTrend,
  getTopMerchants,
  getUploadHistory,
} from "../services/analyticsApi";
import type {
  AnalyticsSummary,
  MonthlyTrendPoint,
  TopMerchant,
  UploadHistoryItem,
} from "../types/analytics";
import ErrorMessage from "../components/common/ErrorMessage";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  getCurrentBusiness,
} from "../utils/businessSession";

import { getInsightsByBusinessId } from "../services/insightApi";
import type { Insight } from "../types/analytics";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(value: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
}

function DashboardPage() {
  const navigate = useNavigate();  // ✅ ADD THIS
  const currentBusiness = getCurrentBusiness();
  const businessId = currentBusiness?.businessId;
  const businessName = currentBusiness?.businessName;

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrendPoint[]>([]);
  const [topMerchants, setTopMerchants] = useState<TopMerchant[]>([]);
  const [uploadHistory, setUploadHistory] = useState<UploadHistoryItem[]>([]);

  const [insights, setInsights] = useState<Insight[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      if (!businessId) {
        setLoading(false);
        setError("No business selected. Please create or select a business first.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        // const [summaryResult, trendResult, merchantsResult, uploadsResult] =
        //   await Promise.all([
        //     getAnalyticsSummary(),
        //     getMonthlyTrend(),
        //     getTopMerchants(),
        //     getUploadHistory(),
        //   ]);
        const [
            summaryResult,
            trendResult,
            merchantsResult,
            uploadsResult,
            insightsResult,
          ] = await Promise.all([
            getAnalyticsSummary(),
            getMonthlyTrend(),
            getTopMerchants(),
            getUploadHistory(),
            getInsightsByBusinessId(businessId),
          ]);
        setSummary(summaryResult);
        setMonthlyTrend(trendResult.slice(-3)); // Show only last 3 months
        setTopMerchants(merchantsResult.slice(0, 3)); // Show only top 3 merchants
        setUploadHistory(uploadsResult.slice(0, 3)); // Show only last 3 uploads
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, [businessId]);

  if (!businessId) {
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ marginBottom: 8 }}>Dashboard</h1>
          <p style={{ marginTop: 0 }}>
            No business selected. Please create or select a business first.
          </p>
        </div>

        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>Dashboard</h1>
        <p style={{ marginTop: 0, color: "#4b5563" }}>
          A quick snapshot of your business activity and recent signals.
        </p>
        <p style={{ marginTop: 8 }}>
          Business: <strong>{businessName ?? "—"}</strong>
        </p>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <SummaryCard
              title="Total Spend"
              value={formatCurrency(summary?.totalAmount ?? 0)}
            />
            <SummaryCard
              title="Transaction Count"
              value={String(summary?.transactionCount ?? 0)}
            />
            <SummaryCard
              title="Average Transaction"
              value={formatCurrency(summary?.averageAmount ?? 0)}
            />
            <SummaryCard
              title="This Month"
              value={formatCurrency(summary?.thisMonthAmount ?? 0)}
            />
            <SummaryCard
              title="Top Merchant"
              value={summary?.topMerchant ?? "—"}
            />
            <SummaryCard
              title="Latest Upload"
              value={formatDate(summary?.latestUploadAt ?? null)}
            />
          </div>

          <section style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ marginBottom: 8 }}>Top Insights</h2>
              <p style={{ marginTop: 0, color: "#6b7280", fontSize: 14 }}>
                Key signals detected from your latest transaction activity.
              </p>
              <button
                onClick={() => navigate("/analytics")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                View all →
              </button>
            </div>

            {insights.length === 0 ? (
              <p>No insights available yet.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {insights.map((insight) => (
                  <InsightPreviewCard key={insight.insightId} insight={insight} />
                ))}
              </div>
            )}
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2>Recent Activity</h2>
            {monthlyTrend.length === 0 ? (
              <p>No trend data available.</p>
            ) : (
              // <SimpleTable
              //   headers={["Month", "Total Amount", "Transaction Count"]}
              //   rows={monthlyTrend.map((item) => [
              //     item.month,
              //     formatCurrency(item.totalAmount),
              //     String(item.transactionCount),
              //   ])}
              // />
              <div style={{ display: "grid", gap: 12 }}>
                {monthlyTrend.map((item) => (
                  <SummaryCard
                    key={item.month}
                    title={item.month}
                    value={formatCurrency(item.totalAmount)}
                  />
                ))}
              </div>
            )}
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2>Top Merchants (Snapshot)</h2>
            {topMerchants.length === 0 ? (
              <p>No merchant data available.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {topMerchants.map((m) => (
                <SummaryCard
                  key={m.merchantName}
                  title={m.merchantName}
                  value={formatCurrency(m.totalAmount)}
                />
                ))}
              </div>          
            )}
          </section>

          <section>
            <h2>Latest Upload</h2>
            {uploadHistory.length === 0 ? (
              <p>No uploads yet.</p>
            ) : (
              <SummaryCard
                title={uploadHistory[0].sourceName}
                value={`Rows: ${uploadHistory[0].rowsInserted ?? "—"} | ${formatDate(uploadHistory[0].createdAt)}`}
              />
            )}
          </section>
          <div style={{ marginTop: 24 }}>
            <button onClick={() => navigate("/analytics")}>
              View Full Analytics →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

type SummaryCardProps = {
  title: string;
  value: string;
};

function SummaryCard({ title, value }: SummaryCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 16,
        backgroundColor: "#fff",
      }}
    >
      <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
function InsightPreviewCard({ insight }: { insight: Insight }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 14,
        backgroundColor: "#fff",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        {insight.title}
      </div>

      <div style={{ color: "#4b5563", fontSize: 14 }}>
        {insight.description}
      </div>
    </div>
  );
}
type SimpleTableProps = {
  headers: string[];
  rows: string[][];
};

function SimpleTable({ headers, rows }: SimpleTableProps) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 12,
        }}
      >
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: "10px 8px",
                  backgroundColor: "#f8f8f8",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}`}
                  style={{
                    borderBottom: "1px solid #eee",
                    padding: "10px 8px",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardPage;