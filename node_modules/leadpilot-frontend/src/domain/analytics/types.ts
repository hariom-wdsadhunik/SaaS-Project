export type MetricCategory =
  | "REVENUE"
  | "PIPELINE"
  | "LEADS"
  | "TASKS"
  | "APPOINTMENTS"
  | "COMMUNICATION"
  | "DOCUMENTS"
  | "PERFORMANCE";

export type MetricPeriod = "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

export type WidgetType =
  | "METRIC_CARD"
  | "LINE_CHART"
  | "BAR_CHART"
  | "FUNNEL_CHART"
  | "PIE_CHART"
  | "TABLE"
  | "AI_RECOMMENDATION"
  | "TOP_PERFORMERS";

export type InsightSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface AnalyticsMetric {
  id: string;
  name: string;
  category: MetricCategory;
  value: number;
  previousValue?: number;
  changePercentage?: number;
  unit: "CURRENCY" | "PERCENTAGE" | "COUNT" | "DAYS" | "HOURS" | "MINUTES";
  target?: number;
  period: MetricPeriod;
  calculatedAt: string;
}

export interface KPI {
  id: string;
  metricKey: string;
  title: string;
  currentValue: number;
  targetValue: number;
  status: "ON_TRACK" | "AT_RISK" | "BEHIND" | "EXCEEDED";
  unit: string;
  period: MetricPeriod;
  trend: "UP" | "DOWN" | "FLAT";
  updatedAt: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  widgetType: WidgetType;
  category: MetricCategory;
  gridSpan: { cols: number; rows: number };
  metricKeys: string[];
  config?: Record<string, unknown>;
}

export interface Dashboard {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  isExecutive: boolean;
  widgets: DashboardWidget[];
  createdAt: string;
  updatedAt: string;
}

export interface ReportFilter {
  field: string;
  operator: "EQUALS" | "CONTAINS" | "GREATER_THAN" | "LESS_THAN" | "BETWEEN";
  value: unknown;
}

export interface Report {
  id: string;
  title: string;
  description?: string;
  category: MetricCategory;
  filters: ReportFilter[];
  columns: string[];
  data: Record<string, unknown>[];
  createdBy: string;
  isScheduled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ForecastPoint {
  date: string;
  predictedValue: number;
  lowerBound: number;
  upperBound: number;
  confidenceScore: number;
}

export interface Forecast {
  id: string;
  metricCategory: MetricCategory;
  targetMetricName: string;
  historicalPeriodDays: number;
  forecastPeriodDays: number;
  points: ForecastPoint[];
  totalPredictedValue: number;
  growthRatePercentage: number;
  generatedAt: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  category: MetricCategory;
  severity: InsightSeverity;
  score: number;
  recommendedAction: string;
  relatedEntityId?: string;
  relatedEntityType?: "LEAD" | "DEAL" | "CONTACT" | "TASK" | "APPOINTMENT";
  generatedAt: string;
}
