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
export type InsightSeverity = "High" | "Medium" | "Low" | string;

export interface StoredInsight {
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

  visualizationType?: string | null;
  visualization?: InsightVisualization | null;
}

export interface TopInsight {
  type: string;
  title: string;
  message: string;
  severity: InsightSeverity;
  recommendation?: string | null;
  description: string;
  estimatedImpact: number;
  currencyCode: string;
  score: number;
  metrics: Record<string, unknown>;
  visualizationType?: string | null;
  visualization?: InsightVisualization | null;
}

export interface TopInsightsResponse {
  businessId: string;
  generatedAtUtc: string;
  lookbackMonths: number;
  insights: TopInsight[];
}
export interface TopInsightCardModel {
  id: string;
  title: string;
  description: string;
  severity: InsightSeverity;
  estimatedImpact?: number | null;
  recommendation?: string | null;
  score?: number | null; 
  visualizationType?: string | null;
  visualization?: InsightVisualization | null;
}

export interface InsightVisualizationSeries {
  name: string;
  values: number[];
  seriesType?: string | null;
}

export interface InsightVisualization {
  chartType: "line" | "bar" | "comparison-bar";
  title?: string | null;
  subtitle?: string | null;
  labels: string[];
  series: InsightVisualizationSeries[];
  highlightIndexes: number[];
}

export interface Insight {
  insightType: string;
  title: string;
  summary: string;
  severity: string;
  score: number;
  estimatedImpact?: number | null;
  visualizationType?: string | null;
  visualization?: InsightVisualization | null;
}
export type BusinessIntelligenceResponse = {
  executiveSummary?: string | null;
  topInsights?: StoredInsight[] | null;
  benchmark?: {
    peerAverageMonthlySpend?: number | null;
    peerMedianMonthlySpend?: number | null;
    percentile?: number | null;
    comparisonSummary?: string | null;
  } | null;
  forecast?: {
    nextMonthSpend?: number | null;
    confidence?: string | null;
    summary?: string | null;
  } | null;
};