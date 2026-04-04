export interface AnalyticsSummary {
  transactionCount: number;
  totalAmount: number;
  averageAmount: number;
  thisMonthAmount: number;
  topMerchant: string | null;
  latestUploadAt: string | null;
}

export interface MonthlyTrendPoint {
  month: string;
  totalAmount: number;
  transactionCount: number;
}

export interface TopMerchant {
  merchantName: string;
  totalAmount: number;
  transactionCount: number;
}

export interface UploadHistoryItem {
  loadId: string;
  businessId: string;
  sourceName: string;
  rowsInFile: number;
  rowsInserted: number | null;
  status: string;
  createdAt: string;
}
export type InsightSeverity = "High" | "Medium" | "Low"| string;
export interface Insight {
  insightId: string;
  loadId: string;
  businessId: string;
  insightType: string;
  severity: InsightSeverity;
  title: string;
  description: string;
  impactLabel?: string | null;
  impactValue?: number | null;
  recommendation?: string | null;
  confidenceScore?: number | null;
  createdAtUtc: string;
}

export interface Insight {
  type: string;
  title: string;
  message: string;
  severity: InsightSeverity;
  estimatedImpact: number;
  currencyCode: string;
  score: number;
  metrics: Record<string, unknown>;
}

export interface TopInsightsResponse {
  businessId: string;
  generatedAtUtc: string;
  lookbackMonths: number;
  insights: Insight[];
}
// export interface BusinessIntelligenceResponse {
//   businessId: string;
//   generatedAtUtc: string;
//   lookbackMonths: number;

//   topInsights: TopInsightsResponse;

//   benchmark: BenchmarkComparison;
//   forecast: SpendForecast;

//   executiveSummary: string; // 👈 THIS is the AI output
// }