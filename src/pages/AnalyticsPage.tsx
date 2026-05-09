
import { useEffect, useState } from "react";
import {
  getAnalyticsSummary,
  getMonthlyTrend,
  getTopMerchants,
  getUploadHistory,
  getBusinessIntelligence,
} from "../services/analyticsApi";

import { getInsightsByBusinessId } from "../services/insightApi";

import type {
  AnalyticsSummary,
  MonthlyTrendPoint,
  TopMerchant,
  UploadHistoryItem,
  StoredInsight,
  BusinessIntelligenceResponse
} from "../types/analytics";
import ErrorMessage from "../components/common/ErrorMessage";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getCurrentBusiness } from "../utils/businessSession";
import TopInsightsPanel from "../components/TopInsightPanel";

import { formatCurrency, formatNullableCurrency, formatDate, 
  formatInsightType, getSeverityStyles, sortInsights } from "../utils/SharedFunctions";

export default function AnalyticsPage() {
  const currentBusiness = getCurrentBusiness();
  const businessId = currentBusiness?.businessId;
  const businessName = currentBusiness?.businessName;

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrendPoint[]>([]);
  const [topMerchants, setTopMerchants] = useState<TopMerchant[]>([]);
  const [uploadHistory, setUploadHistory] = useState<UploadHistoryItem[]>([]);
  const [storedInsights, setStoredInsights] = useState<StoredInsight[]>([]);
  const [businessIntelligence, setBusinessIntelligence] =
    useState<BusinessIntelligenceResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!businessId) {
        setError("No business selected.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [
          summaryResult,
          monthlyTrendResult,
          topMerchantsResult,
          uploadHistoryResult,
          storedInsightsResult,
          businessIntelligenceResult,
        ] = await Promise.all([
          getAnalyticsSummary(),
          getMonthlyTrend(),
          getTopMerchants(),
          getUploadHistory(),
          getInsightsByBusinessId(businessId),
          getBusinessIntelligence(businessId),
        ]);

        setSummary(summaryResult);
        setMonthlyTrend(monthlyTrendResult);
        setTopMerchants(topMerchantsResult);
        setUploadHistory(uploadHistoryResult);
        setStoredInsights(storedInsightsResult);
        setBusinessIntelligence(
          (businessIntelligenceResult as BusinessIntelligenceResponse) ?? null
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [businessId]);

  if (!businessId) {
    return (
      <div>
        <h1>Analytics</h1>
        <p>No business selected. Please create or select a business first.</p>
      </div>
    );
  }

  const latestUpload = uploadHistory[0] ?? null;

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Analytics</h1>
        <p style={{ marginTop: 0 }}>
          Business: <strong>{businessName ?? "—"}</strong>
        </p>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingSpinner />
      ) : !summary ? (
        <p>No analytics available.</p>
      ) : (
        <>
          <TopInsightsPanel />

          <AiBusinessIntelligenceSection data={businessIntelligence} />

          <LatestUploadSummary item={latestUpload} />

          <StoredInsightsSection insights={storedInsights} />

          <section>
            <h2 style={{ marginBottom: 12 }}>Summary</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              <AnalyticsCard
                title="Transaction Count"
                value={String(summary.transactionCount)}
              />
              <AnalyticsCard
                title="Total Amount"
                value={formatCurrency(summary.totalAmount)}
              />
              <AnalyticsCard
                title="Average Amount"
                value={formatCurrency(summary.averageAmount)}
              />
              <AnalyticsCard
                title="This Month"
                value={formatCurrency(summary.thisMonthAmount)}
              />
              <AnalyticsCard
                title="Top Merchant"
                value={summary.topMerchant || "—"}
              />
              <AnalyticsCard
                title="Latest Upload"
                value={formatDate(summary.latestUploadAt)}
              />
            </div>
          </section>

          <section>
            <h2 style={{ marginBottom: 12 }}>Monthly Trend</h2>
            {monthlyTrend.length === 0 ? (
              <p>No monthly trend data available.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                {monthlyTrend.map((item) => (
                  <TrendCard key={item.month} item={item} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 style={{ marginBottom: 12 }}>Top Merchants</h2>
            {topMerchants.length === 0 ? (
              <p>No merchant data available.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: 12,
                  }}
                >
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Merchant</th>
                      <th style={tableHeaderStyle}>Amount</th>
                      <th style={tableHeaderStyle}>Transaction Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMerchants.map((merchant) => (
                      <tr key={merchant.merchantName}>
                        <td style={tableCellStyle}>{merchant.merchantName || "—"}</td>
                        <td style={tableCellStyle}>
                          {formatCurrency(merchant.totalAmount)}
                        </td>
                        <td style={tableCellStyle}>{merchant.transactionCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 style={{ marginBottom: 12 }}>Upload History</h2>
            {uploadHistory.length === 0 ? (
              <p>No upload history available.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: 12,
                  }}
                >
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Source</th>
                      <th style={tableHeaderStyle}>Status</th>
                      <th style={tableHeaderStyle}>Rows in File</th>
                      <th style={tableHeaderStyle}>Rows Inserted</th>
                      <th style={tableHeaderStyle}>Uploaded At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadHistory.map((item) => (
                      <tr key={item.loadId}>
                        <td style={tableCellStyle}>{item.sourceName || "—"}</td>
                        <td style={tableCellStyle}>{item.status || "—"}</td>
                        <td style={tableCellStyle}>{item.rowsInFile}</td>
                        <td style={tableCellStyle}>{item.rowsInserted ?? "—"}</td>
                        <td style={tableCellStyle}>{formatDate(item.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function AiBusinessIntelligenceSection({
  data,
}: {
  data: BusinessIntelligenceResponse | null;
}) {
  const aiInsights = sortInsights(data?.topInsights ?? []);

  return (
    <section
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 16,
        backgroundColor: "#fff",
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ marginBottom: 6 }}>AI Business Intelligence</h2>
        <p style={{ margin: 0, color: "#666" }}>
          AI-generated executive summary, benchmark comparison, forecast, and top
          intelligence signals.
        </p>
      </div>

      {!data ? (
        <p>No AI business intelligence available yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 20 }}>
          <div
            style={{
              border: "1px solid #eee",
              borderRadius: 10,
              padding: 16,
              backgroundColor: "#fafafa",
            }}
          >
            <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
              Executive Summary
            </div>
            <div style={{ lineHeight: 1.6 }}>
              {data.executiveSummary?.trim()
                ? data.executiveSummary
                : "No executive summary available."}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 16,
                backgroundColor: "#fafafa",
              }}
            >
              {/* <h3 style={{ marginTop: 0, marginBottom: 12 }}>Benchmark</h3>
              <div style={{ display: "grid", gap: 10 }}>
                <SummaryItem
                  label="Business Monthly Spend"
                  value={formatNullableCurrency(
                    data.benchmark?.businessMonthlySpend
                  )}
                />
                <SummaryItem
                  label="Benchmark Monthly Spend"
                  value={formatNullableCurrency(
                    data.benchmark?.benchmarkMonthlySpend
                  )}
                />
                <SummaryItem
                  label="Business Average Transaction"
                  value={formatNullableCurrency(
                    data.benchmark?.businessAverageTransaction
                  )}
                />
                <SummaryItem
                  label="Benchmark Average Transaction"
                  value={
                    data.benchmark?.benchmarkAverageTransaction
                  }
                />
                <SummaryItem
                  label="Business Top Vendor Concentration %"
                  value={data.benchmark?.businessTopVendorConcentrationPct}
                />
                <SummaryItem
                  label="Benchmark Top Vendor Concentration %"
                  value={data.benchmark?.benchmarkTopVendorConcentrationPct}
                />
              </div>
            </div>

            <div
              style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 16,
                backgroundColor: "#fafafa",
              }}
            > */}
              <h3 style={{ marginTop: 0, marginBottom: 12 }}>Forecast</h3>
              <div style={{ display: "grid", gap: 10 }}>
                <SummaryItem
                  label="Next Month Spend"
                  value={formatNullableCurrency(data.forecast?.nextMonthForecast)}
                />
                <SummaryItem
                  label="Trend Slope"
                  value={data.forecast?.trendSlope || "—"}
                />
              </div>
            </div>
          </div>

          {/* <div>
            <h3 style={{ marginBottom: 12 }}>AI Top Insights</h3>
            {aiInsights.length === 0 ? (
              <p>No AI insights available.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 16,
                }}
              >
                {aiInsights.map((insight) => (
                  <StoredInsightCard
                    // key={insight.insightId}
                    //key={`${insight.insightType}-${insight.title}-${insight.createdAtUtc}`} // fallback key if insightId is not stable
                    key={Math.random() * (1000000 - 1) + 1}
                    insight={insight}
                  />
                ))}
              </div>
            )}
          </div> */}
        </div>
      )}
    </section>
  );
}

function LatestUploadSummary({ item }: { item: UploadHistoryItem | null }) {
  if (!item) return null;

  return (
    <section
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 16,
        backgroundColor: "#fff",
      }}
    >
      <h2 style={{ marginBottom: 12 }}>Latest Upload</h2>

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
        <SummaryItem label="Uploaded At" value={formatDate(item.createdAt)} />
      </div>
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, wordBreak: "break-word" }}>
        {value}
      </div>
    </div>
  );
}

function StoredInsightsSection({ insights }: { insights: StoredInsight[] }) {
  const filteredInsights = insights.filter(
    (insight) => insight.insightType !== "InterchangeOptimization"
  );

  const sortedInsights = sortInsights(filteredInsights);
  console.log("storedInsights section data", sortedInsights);
  return (
    <section>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ marginBottom: 6 }}>Stored Insight History</h2>
        <p style={{ margin: 0, color: "#666" }}>
          Historical records from earlier insight generation runs. Top Opportunities
          above reflects the current ranked intelligence engine.
        </p>
      </div>

      {sortedInsights.length === 0 ? (
        <p>No stored non-interchangeinsights available yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          {sortedInsights.map((insight) => (
            <StoredInsightCard
              //key={insight.insightId}
              //key={`${insight.insightType}-${insight.title}-${insight.createdAtUtc}`} // fallback key if insightId is not stable
              key={Math.random() * (1000000 - 1) + 1} // temporary random key, replace with stable ID in production
              insight={insight}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type AnalyticsCardProps = {
  title: string;
  value: string;
};

function AnalyticsCard({ title, value }: AnalyticsCardProps) {
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

function TrendCard({ item }: { item: MonthlyTrendPoint }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 16,
        backgroundColor: "#fff",
      }}
    >
      <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
        {item.month}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        {formatCurrency(item.totalAmount)}
      </div>
      <div style={{ fontSize: 14, color: "#444" }}>
        Transactions: {item.transactionCount}
      </div>
    </div>
  );
}

function StoredInsightCard({ insight }: { insight: StoredInsight }) {
  const severityStyle = getSeverityStyles(insight.severity);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 16,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>
            {formatInsightType(insight.insightType)}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{insight.title}</div>
        </div>

        <span
          style={{
            ...severityStyle,
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {insight.severity}
        </span>
      </div>

      <div style={{ color: "#444", lineHeight: 1.5 }}>
        {insight.description}
      </div>

      {insight.impactLabel && (
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 8,
            padding: 12,
            backgroundColor: "#fafafa",
          }}
        >
          <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
            Estimated Impact
          </div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{insight.impactLabel}</div>
        </div>
      )}

      {insight.recommendation && (
        <div
          style={{
            borderLeft: "4px solid #2563eb",
            borderRadius: 8,
            padding: "10px 12px",
            backgroundColor: "#f8fafc",
          }}
        >
          <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
            Recommended Action
          </div>
          <div>{insight.recommendation}</div>
        </div>
      )}
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  textAlign: "left",
  padding: 12,
  borderBottom: "1px solid #ddd",
  backgroundColor: "#f8f8f8",
};

const tableCellStyle: React.CSSProperties = {
  padding: 12,
  borderBottom: "1px solid #eee",
};
