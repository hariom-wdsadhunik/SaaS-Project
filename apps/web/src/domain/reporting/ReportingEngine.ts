import {
  KpiMetric,
  CustomDashboardLayout,
  ScheduledReportConfig,
  ExportFormat,
} from "./ReportingTypes";

export class ReportingEngine {
  private static mockKpis: KpiMetric[] = [
    {
      id: "kpi-rev",
      name: "Total Gross Revenue",
      category: "REVENUE",
      value: 32200000,
      previousValue: 27200000,
      changePercentage: 18.4,
      trend: "UP",
      unit: "$",
      formattedValue: "$32.2M",
    },
    {
      id: "kpi-pipe",
      name: "Total Pipeline Value",
      category: "SALES",
      value: 84500000,
      previousValue: 79000000,
      changePercentage: 6.9,
      trend: "UP",
      unit: "$",
      formattedValue: "$84.5M",
    },
    {
      id: "kpi-mrr",
      name: "Monthly Recurring Revenue (MRR)",
      category: "FINANCE",
      value: 299000,
      previousValue: 265000,
      changePercentage: 12.8,
      trend: "UP",
      unit: "$",
      formattedValue: "$299K",
    },
    {
      id: "kpi-arr",
      name: "Annual Recurring Revenue (ARR)",
      category: "FINANCE",
      value: 3588000,
      previousValue: 3180000,
      changePercentage: 12.8,
      trend: "UP",
      unit: "$",
      formattedValue: "$3.58M",
    },
    {
      id: "kpi-churn",
      name: "Customer Churn Rate",
      category: "FINANCE",
      value: 1.2,
      previousValue: 1.8,
      changePercentage: -33.3,
      trend: "DOWN",
      unit: "%",
      formattedValue: "1.2%",
    },
    {
      id: "kpi-retention",
      name: "Net Revenue Retention",
      category: "FINANCE",
      value: 114.5,
      previousValue: 108.2,
      changePercentage: 5.8,
      trend: "UP",
      unit: "%",
      formattedValue: "114.5%",
    },
    {
      id: "kpi-won",
      name: "Deals Won (YTD)",
      category: "SALES",
      value: 35,
      previousValue: 29,
      changePercentage: 20.7,
      trend: "UP",
      formattedValue: "35 Deals",
    },
    {
      id: "kpi-conv",
      name: "Lead Conversion Rate",
      category: "SALES",
      value: 35.2,
      previousValue: 31.1,
      changePercentage: 13.2,
      trend: "UP",
      unit: "%",
      formattedValue: "35.2%",
    },
    {
      id: "kpi-velocity",
      name: "Average Sales Velocity",
      category: "SALES",
      value: 18.4,
      previousValue: 22.1,
      changePercentage: -16.7,
      trend: "UP",
      unit: "days",
      formattedValue: "18.4 Days",
    },
  ];

  private static mockLayouts: CustomDashboardLayout[] = [
    {
      id: "dash-101",
      name: "Executive Performance Overview",
      description: "High-level overview of revenue, ARR, pipeline growth, and net retention.",
      organizationId: "org-1",
      ownerId: "usr-1",
      isShared: true,
      widgets: [
        { id: "w-1", title: "Revenue & ARR Trend", chartType: "AREA", metricKey: "kpi-rev", gridSpan: 2 },
        { id: "w-2", title: "Pipeline Stages Funnel", chartType: "FUNNEL", metricKey: "kpi-pipe", gridSpan: 2 },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private static mockScheduled: ScheduledReportConfig[] = [
    {
      id: "sched-101",
      name: "Weekly Executive Brief",
      reportType: "EXECUTIVE",
      frequency: "WEEKLY",
      recipients: ["alex@leadpilot.ai", "board@leadpilot.ai"],
      format: "PDF",
      enabled: true,
      lastSentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      nextScheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
    },
  ];

  public static getKpis(): KpiMetric[] {
    return this.mockKpis;
  }

  public static getCustomDashboards(): CustomDashboardLayout[] {
    return this.mockLayouts;
  }

  public static getScheduledReports(): ScheduledReportConfig[] {
    return this.mockScheduled;
  }

  public static exportData(entity: string, format: ExportFormat): string {
    if (format === "JSON") {
      return JSON.stringify({ entity, exportedAt: new Date().toISOString(), records: 150 }, null, 2);
    }
    return `ID,Entity,Value,Date\n1,${entity},150000,${new Date().toISOString()}`;
  }
}
