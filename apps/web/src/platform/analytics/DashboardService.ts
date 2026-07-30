import { Dashboard, DashboardWidget } from "@/domain/analytics/types";
import { KPIEngine } from "./KPIEngine";
import { InsightEngine } from "./insights/InsightEngine";
import { eventBus } from "@/platform/events/EventBus";

export class DashboardService {
  public static async getExecutiveDashboard(): Promise<Dashboard> {
    const widgets: DashboardWidget[] = [
      {
        id: "w-rev",
        title: "Revenue & Deal Value",
        widgetType: "METRIC_CARD",
        category: "REVENUE",
        gridSpan: { cols: 3, rows: 1 },
        metricKeys: ["AVG_DEAL_VALUE", "WIN_RATE"],
      },
      {
        id: "w-pipe",
        title: "Total Pipeline & Velocity",
        widgetType: "LINE_CHART",
        category: "PIPELINE",
        gridSpan: { cols: 3, rows: 1 },
        metricKeys: ["PIPELINE_VALUE", "PIPELINE_VELOCITY"],
      },
      {
        id: "w-funnel",
        title: "Lead Conversion Funnel",
        widgetType: "FUNNEL_CHART",
        category: "LEADS",
        gridSpan: { cols: 3, rows: 1 },
        metricKeys: ["LEAD_CONVERSION_RATE", "FIRST_RESPONSE_TIME"],
      },
      {
        id: "w-tasks",
        title: "Tasks & Productivity",
        widgetType: "BAR_CHART",
        category: "TASKS",
        gridSpan: { cols: 3, rows: 1 },
        metricKeys: ["TASK_COMPLETION_RATE"],
      },
      {
        id: "w-appts",
        title: "Appointments & Walkthroughs",
        widgetType: "BAR_CHART",
        category: "APPOINTMENTS",
        gridSpan: { cols: 3, rows: 1 },
        metricKeys: ["APPOINTMENT_COMPLETION_RATE"],
      },
      {
        id: "w-comm",
        title: "Omnichannel Activity",
        widgetType: "LINE_CHART",
        category: "COMMUNICATION",
        gridSpan: { cols: 3, rows: 1 },
        metricKeys: ["COMMUNICATION_ACTIVITY"],
      },
      {
        id: "w-docs",
        title: "Document Storage & OCR",
        widgetType: "METRIC_CARD",
        category: "DOCUMENTS",
        gridSpan: { cols: 3, rows: 1 },
        metricKeys: ["DOCUMENT_ACTIVITY"],
      },
      {
        id: "w-top",
        title: "Top Performing Broker Agents",
        widgetType: "TOP_PERFORMERS",
        category: "PERFORMANCE",
        gridSpan: { cols: 6, rows: 2 },
        metricKeys: ["SALES_CYCLE_LENGTH"],
      },
      {
        id: "w-ai",
        title: "AI Executive Recommendations",
        widgetType: "AI_RECOMMENDATION",
        category: "REVENUE",
        gridSpan: { cols: 6, rows: 2 },
        metricKeys: [],
      },
    ];

    const dashboard: Dashboard = {
      id: "dash-executive",
      title: "LeadPilot Executive Business Intelligence Dashboard",
      description: "Realtime cross-functional analytics overview across sales pipeline, communication, documents, and AI insights.",
      ownerId: "agent-001",
      isExecutive: true,
      widgets,
      createdAt: "2026-07-20T10:00:00Z",
      updatedAt: new Date().toISOString(),
    };

    await eventBus.publish("DashboardUpdated", dashboard.id, { isExecutive: true });
    return dashboard;
  }

  public static async refreshDashboard(isExecutive: boolean = true): Promise<Dashboard> {
    KPIEngine.invalidateAllCache();
    await InsightEngine.generateInsights();
    return isExecutive ? this.getExecutiveDashboard() : this.getExecutiveDashboard();
  }
}
