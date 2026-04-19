import React, { useMemo, useState } from "react";
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
  PieChart,
  Pie,
  Cell,
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
// import { defineConfig } from 'vite'
// import tailwindcss from '@tailwindcss/vite'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Chase-inspired FinIntel mobile-first dashboard
 * ------------------------------------------------
 * - Single-file prototype meant to drop into ChatGPT canvas for preview/iteration
 * - Uses local mock data now, but structure mirrors likely FinIntel API shapes
 * - Replace mock data + helper formatters with live data from your API client
 */

const monthlyTrend = [
  { label: "Jan", spend: 6220, income: 13800 },
  { label: "Feb", spend: 5880, income: 14120 },
  { label: "Mar", spend: 6750, income: 14650 },
  { label: "Apr", spend: 7125, income: 15100 },
];

const weeklyTrend = [
  { label: "Mar 23-29", spend: 913 },
  { label: "Mar 30-Apr 5", spend: 756 },
  { label: "Apr 6-12", spend: 898 },
  { label: "Apr 13-17", spend: 398 },
];

const topInsights = [
  {
    id: "1",
    type: "InterchangeOpportunity",
    severity: "High",
    title: "Potential interchange savings identified",
    description:
      "Several large card-not-present transactions may qualify for lower-cost processing with improved data capture.",
    impactLabel: "Estimated annual savings",
    impactValue: 12480,
    confidence: 0.87,
    icon: CreditCard,
  },
  {
    id: "2",
    type: "SpendAnomaly",
    severity: "Medium",
    title: "Office supply spend rose sharply",
    description:
      "April office supply spend is 41% above the trailing 3-month average.",
    impactLabel: "Observed increase",
    impactValue: 1640,
    confidence: 0.81,
    icon: AlertTriangle,
  },
  {
    id: "3",
    type: "VendorConcentration",
    severity: "Medium",
    title: "Top vendor concentration is elevated",
    description:
      "Your top 3 vendors represent 56% of card spend this month, increasing dependency risk.",
    impactLabel: "Top 3 concentration",
    impactValue: 56,
    isPercent: true,
    confidence: 0.76,
    icon: Building2,
  },
  {
    id: "4",
    type: "DuplicateCharge",
    severity: "Low",
    title: "Possible duplicate charges found",
    description:
      "2 transactions share the same merchant, amount, and near-identical timestamp pattern.",
    impactLabel: "Potential recovery",
    impactValue: 318.22,
    confidence: 0.72,
    icon: RefreshCw,
  },
];

const topMerchants = [
  { name: "Amazon Business", transactions: 18, total: 1840 },
  { name: "Staples", transactions: 9, total: 1325 },
  { name: "Delta", transactions: 5, total: 1180 },
  { name: "Restaurant Depot", transactions: 12, total: 965 },
];

const categories = [
  { name: "Software", thisMonth: 1890, lastMonth: 1610, share: 29 },
  { name: "Travel", thisMonth: 1415, lastMonth: 830, share: 22 },
  { name: "Office", thisMonth: 1280, lastMonth: 910, share: 20 },
  { name: "Meals", thisMonth: 860, lastMonth: 940, share: 13 },
  { name: "Other", thisMonth: 980, lastMonth: 1120, share: 16 },
];

const cashFlow = [
  { label: "Jan", inflow: 13800, outflow: 6220 },
  { label: "Feb", inflow: 14120, outflow: 5880 },
  { label: "Mar", inflow: 14650, outflow: 6750 },
  { label: "Apr", inflow: 15100, outflow: 7125 },
];

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

function formatPercent(value: number) {
  return `${value.toFixed(0)}%`;
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

function deltaPercent(current: number, previous: number) {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

export default function FinIntelChaseInspiredDashboard() {
  const [trendView, setTrendView] = useState<"weekly" | "monthly">("weekly");
  const [cashFlowView, setCashFlowView] = useState<"income" | "expenses">("income");

  const totalSpendThisMonth = 7125;
  const totalSpendLastMonth = 6750;
  const totalInflowThisMonth = 15100;
  const avgTicket = 186.54;
  const duplicateRecovery = 318.22;
  const spendDelta = deltaPercent(totalSpendThisMonth, totalSpendLastMonth);

  const trendData = trendView === "weekly" ? weeklyTrend : monthlyTrend;

  const featuredInsight = topInsights[0];

  const categoryChartData = useMemo(
    () => categories.map((c, idx) => ({ ...c, fill: ["#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6"][idx] })),
    []
  );

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
              <p className="mt-1 text-sm text-blue-100">Business financial intelligence for your account</p>
            </div>
            <Badge className="rounded-full border-white/20 bg-white/10 px-3 py-1 text-white backdrop-blur">
              As of Apr 17
            </Badge>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <HeroStatCard
              label="Spend this month"
              value={formatCurrency(totalSpendThisMonth)}
              subValue={`${spendDelta >= 0 ? "+" : ""}${spendDelta.toFixed(1)}% vs last month`}
              positive={spendDelta <= 0}
              icon={<Wallet className="h-4 w-4" />}
            />
            <HeroStatCard
              label="Cash in"
              value={formatCurrency(totalInflowThisMonth)}
              subValue="Current month"
              positive
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

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <ChartCard
              title="Card and account activity"
              description="A simple trend view that tells the story quickly"
              rightSlot={
                <Tabs value={trendView} onValueChange={(v) => setTrendView(v as "weekly" | "monthly") }>
                  <TabsList className="grid h-10 w-[220px] grid-cols-2 rounded-xl bg-slate-100">
                    <TabsTrigger value="weekly" className="rounded-lg">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly" className="rounded-lg">Monthly</TabsTrigger>
                  </TabsList>
                </Tabs>
              }
            >
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} barCategoryGap={28}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickFormatter={(v) => `$${v}`} tickLine={false} axisLine={false} fontSize={12} width={42} />
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
                        ? "This week is pacing below the prior three-week average, which may indicate normalizing spend."
                        : "Monthly spend has trended upward for two consecutive periods and is worth monitoring."}
                    </p>
                  </div>
                  <Button variant="outline" className="rounded-full">See chart as table</Button>
                </div>
              </div>
            </ChartCard>

            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Recommended for you</CardTitle>
                    <p className="mt-1 text-sm text-slate-500">Actionable opportunities, not just reporting</p>
                  </div>
                  <Lightbulb className="h-5 w-5 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <FeaturedInsightCard insight={featuredInsight} />
                <div className="grid gap-3">
                  {topInsights.slice(1).map((insight) => (
                    <CompactInsightRow key={insight.id} insight={insight} />
                  ))}
                </div>
                <Button className="w-full rounded-full">See spending summary</Button>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Cash flow</CardTitle>
                    <p className="mt-1 text-sm text-slate-500">Checking and savings</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 pb-4">
                  <MiniMetric label="Money in" value={formatCurrency(totalInflowThisMonth)} icon={<ArrowDownRight className="h-4 w-4" />} />
                  <MiniMetric label="Money out" value={formatCurrency(totalSpendThisMonth)} icon={<ArrowUpRight className="h-4 w-4" />} />
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cashFlow}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} tickLine={false} axisLine={false} fontSize={12} width={42} />
                      <Tooltip formatter={(v: number) => formatCurrencyTight(v)} />
                      <Line type="monotone" dataKey={cashFlowView === "income" ? "inflow" : "outflow"} strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4">
                  <Tabs value={cashFlowView} onValueChange={(v) => setCashFlowView(v as "income" | "expenses") }>
                    <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl bg-slate-100">
                      <TabsTrigger value="income" className="rounded-lg">Income</TabsTrigger>
                      <TabsTrigger value="expenses" className="rounded-lg">Expenses</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">April spending by merchant</CardTitle>
                    <p className="mt-1 text-sm text-slate-500">As of Apr 17</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topMerchants.map((merchant, idx) => (
                    <div key={merchant.name}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                            {merchant.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900">{merchant.name}</p>
                            <p className="text-xs text-slate-500">{merchant.transactions} transactions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">{formatCurrency(merchant.total)}</p>
                          <p className="text-xs text-slate-500">total</p>
                        </div>
                      </div>
                      {idx < topMerchants.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-5 w-full rounded-full">See more merchants</Button>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Spending by category</CardTitle>
                <p className="text-sm text-slate-500">This month compared with last month</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryChartData} dataKey="share" nameKey="name" innerRadius={50} outerRadius={82} paddingAngle={3}>
                        {categoryChartData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <ScrollArea className="max-h-80 pr-2">
                  <div className="space-y-4">
                    {categories.map((category, idx) => {
                      const rising = category.thisMonth > category.lastMonth;
                      return (
                        <div key={category.name} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-700">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">{category.name}</p>
                              <p className="text-xs text-slate-500">Share of spend: {formatPercent(category.share)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900">{formatCurrency(category.thisMonth)}</p>
                            <p className={`text-xs ${rising ? "text-amber-600" : "text-emerald-600"}`}>
                              Last month: {formatCurrency(category.lastMonth)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                <Button variant="outline" className="w-full rounded-full">See all categories</Button>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Manage your business</CardTitle>
                <p className="text-sm text-slate-500">Next best actions for the owner or finance lead</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <ActionTile title="Set up vendor controls" subtitle="Reduce duplicate or out-of-policy spend" />
                <ActionTile title="Review processor fees" subtitle="Capture interchange optimization opportunities" />
                <ActionTile title="Create a monthly budget" subtitle="Track category drift earlier" />
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

function FeaturedInsightCard({ insight }: { insight: (typeof topInsights)[number] }) {
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
            {insight.isPercent ? formatPercent(insight.impactValue) : formatCurrency(insight.impactValue)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Confidence</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{Math.round(insight.confidence * 100)}%</p>
        </div>
      </div>
    </div>
  );
}

function CompactInsightRow({ insight }: { insight: (typeof topInsights)[number] }) {
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
          {insight.isPercent ? formatPercent(insight.impactValue) : formatCurrencyTight(insight.impactValue)}
        </p>
        <p className="text-xs text-slate-500">{insight.impactLabel}</p>
      </div>
    </div>
  );
}

function MiniMetric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
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

function ActionTile({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50">
      <div>
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-400" />
    </button>
  );
}
