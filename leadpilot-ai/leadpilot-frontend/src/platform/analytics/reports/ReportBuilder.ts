import { MetricCategory, Report, ReportFilter } from "@/domain/analytics/types";

export interface BuildReportInput {
  title: string;
  category: MetricCategory;
  filters?: ReportFilter[];
  columns?: string[];
  rawRows?: Record<string, unknown>[];
  createdBy?: string;
}

export class ReportBuilder {
  public static buildReport(input: BuildReportInput): Report {
    const now = new Date().toISOString();
    const columns = input.columns || ["id", "entity_name", "category", "metric_value", "created_at"];
    const defaultData = input.rawRows || [
      { id: "rep-101", entity_name: "Palm Penthouse Buyout", category: input.category, metric_value: "$3,500,000", created_at: "2026-07-25" },
      { id: "rep-102", entity_name: "Commercial Plot Lease", category: input.category, metric_value: "$1,800,000", created_at: "2026-07-24" },
      { id: "rep-103", entity_name: "Beachfront Villa Portfolio", category: input.category, metric_value: "$2,400,000", created_at: "2026-07-23" },
    ];

    return {
      id: `rpt-${Date.now()}`,
      title: input.title,
      description: `Custom generated report for ${input.category} metrics`,
      category: input.category,
      filters: input.filters || [],
      columns,
      data: defaultData,
      createdBy: input.createdBy || "agent-001",
      createdAt: now,
      updatedAt: now,
    };
  }
}
