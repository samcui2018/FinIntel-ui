import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Building2,
  CreditCard,
  DollarSign,
  Lightbulb,
  RefreshCw,
  TrendingUp,
  Wallet,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import {
  getAnalyticsSummary,
  getMonthlyTrend,
  getTopMerchants,
  getUploadHistory,
  getTopInsights,
} from "../services/analyticsApi";
import type {
  AnalyticsSummary,
  MonthlyTrendPoint,
  TopInsight,
  TopInsightsResponse,
  TopMerchant,
  UploadHistoryItem,
} from "../types/analytics";

import ErrorMessage from "../components/common/ErrorMessage";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getCurrentBusiness } from "../utils/businessSession";

// Temporary note:
// If your shadcn imports are still broken, replace these with plain div/button wrappers first.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type TrendView = "weekly" | "monthly";
type CashFlowView = "income" | "expenses";

type UiInsight = {
  id: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  impactLabel: string;
  impactValue: number;
  confidence: number;
  isPercent?: boolean;
  icon: React.ComponentType<{ className?: string }>;
};

type ChartTrendPoint = {
  label: string;
  spend: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrencyTight(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

function deltaPercent(current: number, previous: number) {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

function severityBadgeClass(severity: string) {
  switch (severity) {
    case "High":
      return "bg-red-50 text-red-700 border-red-200";
    case "Medium":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function getInsightIcon(type: string) {
  const normalized = type.toLowerCase();

  if (normalized.includes("interchange")) return CreditCard;
  if (normalized.includes("anomaly")) return AlertTriangle;
  if (normalized.includes("vendor") || normalized.includes("merchant")) return Building2;
  if (normalized.includes("duplicate")) return RefreshCw;

  return Lightbulb;
}

function getImpactLabel(type: string) {
  const normalized = type.toLowerCase();

  if (normalized.includes("interchange")) return "Estimated savings";
  if (normalized.includes("duplicate")) return "Potential recovery";
  if (normalized.includes("anomaly")) return "Estimated impact";

  return "Estimated impact";
}

function mapInsight(insight: TopInsight, index: number): UiInsight {
  return {
    id: `${insight.type}-${index}`,
    type: insight.type,
    severity: insight.severity,
    title: insight.title,
    description: insight.description || insight.message || "No description available.",
    impactLabel: getImpactLabel(insight.type),
    impactValue: insight.estimatedImpact ?? 0,
    confidence: Math.max(0, Math.min(1, (insight.score ?? 0) / 500)), // normalize score roughly for UI
    icon: getInsightIcon(insight.type),
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const currentBusiness = getCurrentBusiness();
  const businessId = currentBusiness?.businessId;
  const businessName = currentBusiness?.businessName;

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrendPoint[]>([]);
  const [topMerchants, setTopMerchants] = useState<TopMerchant[]>([]);
  const [uploadHistory, setUploadHistory] = useState<UploadHistoryItem[]>([]);
  const [insights, setInsights] = useState<TopInsight[]>([]);

  const [trendView, setTrendView] = useState<TrendView>("monthly");
  const [cashFlowView, setCashFlowView] = useState<CashFlowView>("expenses");

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
          getTopInsights(),
        ]);

        setSummary(summaryResult);
        setMonthlyTrend(trendResult);
        setTopMerchants(merchantsResult.slice(0, 4));
        setUploadHistory(uploadsResult.slice(0, 3));
        setInsights(insightsResult.insights.slice(0, 4));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, [businessId]);

  const monthlyTrendData: ChartTrendPoint[] = useMemo(
    () =>
      monthlyTrend.map((item) => ({
        label: item.month,
        spend: item.totalAmount,
      })),
    [monthlyTrend]
  );

  const weeklyTrendData: ChartTrendPoint[] = useMemo(() => {
    // Temporary fallback until you have true weekly API data.
    // Keeps the tab working without inventing unrelated numbers.
    return monthlyTrendData.slice(-4);
  }, [monthlyTrendData]);

  const trendData = trendView === "weekly" ? weeklyTrendData : monthlyTrendData;

  const mappedInsights = useMemo(() => insights.map(mapInsight), [insights]);
  const featuredInsight = mappedInsights[0];

  const totalSpendThisMonth = summary?.thisMonthAmount ?? 0;
  const totalSpendLastMonth =
    monthlyTrend.length >= 2 ? monthlyTrend[monthlyTrend.length - 2].totalAmount : 0;
  const totalInflowThisMonth = 0; // hide or replace later when you have real inflow data
  const avgTicket = summary?.averageAmount ?? 0;

  const duplicateRecovery =
    insights.find((x) => x.type.toLowerCase().includes("duplicate"))?.estimatedImpact ?? 0;

  const spendDelta = deltaPercent(totalSpendThisMonth, totalSpendLastMonth);

  if (!businessId) {
    return (
      <div className="p-6">
        <ErrorMessage message="No business selected. Please create or select a business first." />
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-md px-4 py-5 sm:max-w-6xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="mb-5 rounded-[28px] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 px-5 pb-8 pt-6 text-white shadow-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm/6 text-blue-100">Snapshot</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">FinIntel</h1>
              <p className="mt-1 text-sm text-blue-100">
                {businessName ? `${businessName} financial intelligence` : "Business financial intelligence"}
              </p>
            </div>
            <Badge className="rounded-full border-white/20 bg-white/10 px-3 py-1 text-white backdrop-blur">
              {uploadHistory[0]?.createdAt ? formatDate(uploadHistory[0].createdAt) : "Latest"}
            </Badge>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <HeroStatCard
              label="Spend this month"
              value={formatCurrency(totalSpendThisMonth)}
              subValue={`${spendDelta >= 0 ? "+" : ""}${spendDelta.toFixed(1)}% vs prior period`}
              positive={spendDelta <= 0}
              icon={<Wallet className="h-4 w-4" />}
            />
            <HeroStatCard
              label="Transaction count"
              value={String(summary?.transactionCount ?? 0)}
              subValue="Current month snapshot"
              positive={null}
              icon={<DollarSign className="h-4 w-4" />}
            />
            <HeroStatCard
              label="Average ticket"
              value={formatCurrencyTight(avgTicket)}
              subValue="Per posted transaction"
              positive={null}
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <HeroStatCard
              label="Potential recovery"
              value={formatCurrencyTight(duplicateRecovery)}
              subValue="Duplicates + exceptions"
              positive
              icon={<Sparkles className="h-4 w-4" />}
            />
          </div>
        </motion.div>

        <ErrorMessage message={error} />

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <ChartCard
              title="Card and account activity"
              description="A simple trend view that tells the story quickly"
              rightSlot={
                <Tabs value={trendView} onValueChange={(v) => setTrendView(v as TrendView)}>
                  <TabsList className="grid h-10 w-[220px] grid-cols-2 rounded-xl bg-slate-100">
                    <TabsTrigger value="weekly" className="rounded-lg">
                      Weekly
                    </TabsTrigger>
                    <TabsTrigger value="monthly" className="rounded-lg">
                      Monthly
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              }
            >
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} barCategoryGap={28}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis
                      tickFormatter={(v) => `$${v}`}
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      width={42}
                    />
                    <Tooltip formatter={(v: number) => formatCurrencyTight(v)} />
                    <Bar dataKey="spend" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Quick read</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {trendView === "weekly"
                        ? "Weekly mode is currently derived from the most recent trend points until a dedicated weekly API is added."
                        : "Monthly spend reflects the business activity returned from your live analytics API."}
                    </p>
                  </div>
                  <Button variant="outline" className="rounded-full">
                    See chart as table
                  </Button>
                </div>
              </div>
            </ChartCard>

            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Recommended for you</CardTitle>
                    <p className="mt-1 text-sm text-slate-500">
                      Actionable opportunities, not just reporting
                    </p>
                  </div>
                  <Lightbulb className="h-5 w-5 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {featuredInsight ? (
                  <>
                    <FeaturedInsightCard insight={featuredInsight} />
                    <div className="grid gap-3">
                      {mappedInsights.slice(1).map((insight) => (
                        <CompactInsightRow key={insight.id} insight={insight} />
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">No insights available yet.</p>
                )}

                <Button className="w-full rounded-full" onClick={() => navigate("/analytics")}>
                  See spending summary
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Monthly spend trend</CardTitle>
                <p className="mt-1 text-sm text-slate-500">Live analytics data</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 pb-4">
                  <MiniMetric
                    label="This month"
                    value={formatCurrency(totalSpendThisMonth)}
                    icon={<ArrowUpRight className="h-4 w-4" />}
                  />
                  <MiniMetric
                    label="Top merchant"
                    value={summary?.topMerchant ?? "—"}
                    icon={<ArrowDownRight className="h-4 w-4" />}
                  />
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendData}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis
                        tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        width={42}
                      />
                      <Tooltip formatter={(v: number) => formatCurrencyTight(v)} />
                      <Line type="monotone" dataKey="spend" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Top merchants</CardTitle>
                    <p className="mt-1 text-sm text-slate-500">Live merchant snapshot</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topMerchants.length === 0 ? (
                    <p className="text-sm text-slate-500">No merchant data available.</p>
                  ) : (
                    topMerchants.map((merchant, idx) => (
                      <div key={merchant.merchantName}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                              {merchant.merchantName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-900">
                                {merchant.merchantName}
                              </p>
                              <p className="text-xs text-slate-500">
                                {merchant.transactionCount} transactions
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900">
                              {formatCurrency(merchant.totalAmount)}
                            </p>
                            <p className="text-xs text-slate-500">total</p>
                          </div>
                        </div>
                        {idx < topMerchants.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))
                  )}
                </div>

                <Button variant="outline" className="mt-5 w-full rounded-full" onClick={() => navigate("/analytics")}>
                  See more merchants
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Latest upload</CardTitle>
                <p className="text-sm text-slate-500">Most recent ingestion activity</p>
              </CardHeader>
              <CardContent>
                {uploadHistory.length === 0 ? (
                  <p className="text-sm text-slate-500">No uploads yet.</p>
                ) : (
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-sm font-medium text-slate-900">{uploadHistory[0].sourceName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Rows: {uploadHistory[0].rowsInserted ?? "—"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(uploadHistory[0].createdAt)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroStatCard({
  label,
  value,
  subValue,
  positive,
  icon,
}: {
  label: string;
  value: string;
  subValue: string;
  positive: boolean | null;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-blue-100">{label}</p>
        <div className="text-blue-50">{icon}</div>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</p>
      <div className="mt-1 flex items-center gap-1 text-xs text-blue-100">
        {positive === null ? null : positive ? (
          <ArrowDownRight className="h-3.5 w-3.5" />
        ) : (
          <ArrowUpRight className="h-3.5 w-3.5" />
        )}
        <span>{subValue}</span>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  description,
  rightSlot,
  children,
}: {
  title: string;
  description: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-[24px] border-0 shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          {rightSlot}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function FeaturedInsightCard({ insight }: { insight: UiInsight }) {
  const Icon = insight.icon;
  return (
    <div className="rounded-[22px] border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
              <Badge variant="outline" className={`rounded-full ${severityBadgeClass(insight.severity)}`}>
                {insight.severity}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-600">{insight.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">{insight.impactLabel}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {insight.isPercent ? `${insight.impactValue}%` : formatCurrencyTight(insight.impactValue)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Confidence</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {Math.round(insight.confidence * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}

function CompactInsightRow({ insight }: { insight: UiInsight }) {
  const Icon = insight.icon;
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 p-3">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium text-slate-900">{insight.title}</p>
            <Badge variant="outline" className={`rounded-full ${severityBadgeClass(insight.severity)}`}>
              {insight.severity}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500">{insight.description}</p>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-slate-900">
          {insight.isPercent ? `${insight.impactValue}%` : formatCurrencyTight(insight.impactValue)}
        </p>
        <p className="text-xs text-slate-500">{insight.impactLabel}</p>
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}

