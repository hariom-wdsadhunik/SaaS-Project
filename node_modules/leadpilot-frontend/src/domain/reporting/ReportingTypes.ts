export type ChartType =
  | "LINE"
  | "BAR"
  | "AREA"
  | "PIE"
  | "DONUT"
  | "FUNNEL"
  | "KANBAN_METRICS"
  | "HEATMAP"
  | "TABLE"
  | "TREND_CARD";

export type ExportFormat = "CSV" | "EXCEL" | "PDF" | "JSON";

export type ScheduleFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY";

export interface KpiMetric {
  id: string;
  name: string;
  category: "REVENUE" | "SALES" | "OPERATIONS" | "FINANCE" | "AUTOMATION";
  value: number | string;
  previousValue: number | string;
  changePercentage: number;
  trend: "UP" | "DOWN" | "NEUTRAL";
  unit?: string;
  formattedValue: string;
}

export interface WidgetConfig {
  id: string;
  title: string;
  chartType: ChartType;
  metricKey: string;
  gridSpan: number; // 1, 2, 3, or 4 columns
  heightPx?: number;
}

export interface CustomDashboardLayout {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  ownerId: string;
  isShared: boolean;
  widgets: WidgetConfig[];
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledReportConfig {
  id: string;
  name: string;
  reportType: "EXECUTIVE" | "SALES" | "FINANCE" | "CUSTOM";
  frequency: ScheduleFrequency;
  recipients: string[];
  format: ExportFormat;
  enabled: boolean;
  lastSentAt?: string;
  nextScheduledAt: string;
}

export interface DataExportOptions {
  entity: "LEADS" | "DEALS" | "PROPERTIES" | "TASKS" | "FINANCE" | "AUDIT";
  format: ExportFormat;
  dateRange: { start: string; end: string };
  filters?: Record<string, string | number | boolean>;
}
