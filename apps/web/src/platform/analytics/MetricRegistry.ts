import { MetricCategory } from "@/domain/analytics/types";

export interface MetricDefinition {
  key: string;
  name: string;
  category: MetricCategory;
  unit: "CURRENCY" | "PERCENTAGE" | "COUNT" | "DAYS" | "HOURS" | "MINUTES";
  description: string;
}

export class MetricRegistry {
  private static definitions: Map<string, MetricDefinition> = new Map([
    [
      "LEAD_CONVERSION_RATE",
      { key: "LEAD_CONVERSION_RATE", name: "Lead Conversion Rate", category: "LEADS", unit: "PERCENTAGE", description: "Percentage of leads converted to qualified opportunities." },
    ],
    [
      "WIN_RATE",
      { key: "WIN_RATE", name: "Deal Win Rate", category: "REVENUE", unit: "PERCENTAGE", description: "Percentage of closed deals marked as won." },
    ],
    [
      "AVG_DEAL_VALUE",
      { key: "AVG_DEAL_VALUE", name: "Average Deal Value", category: "REVENUE", unit: "CURRENCY", description: "Mean value across all active and won deals." },
    ],
    [
      "PIPELINE_VALUE",
      { key: "PIPELINE_VALUE", name: "Total Pipeline Value", category: "PIPELINE", unit: "CURRENCY", description: "Summed value of all active pipeline opportunities." },
    ],
    [
      "PIPELINE_VELOCITY",
      { key: "PIPELINE_VELOCITY", name: "Pipeline Velocity", category: "PIPELINE", unit: "CURRENCY", description: "Estimated revenue generated per day based on velocity formula." },
    ],
    [
      "SALES_CYCLE_LENGTH",
      { key: "SALES_CYCLE_LENGTH", name: "Sales Cycle Length", category: "PERFORMANCE", unit: "DAYS", description: "Average days elapsed from lead creation to deal close." },
    ],
    [
      "FIRST_RESPONSE_TIME",
      { key: "FIRST_RESPONSE_TIME", name: "Lead Response Time", category: "PERFORMANCE", unit: "MINUTES", description: "Average minutes elapsed before first agent outreach." },
    ],
    [
      "TASK_COMPLETION_RATE",
      { key: "TASK_COMPLETION_RATE", name: "Task Completion Rate", category: "TASKS", unit: "PERCENTAGE", description: "Percentage of assigned CRM tasks completed on schedule." },
    ],
    [
      "APPOINTMENT_COMPLETION_RATE",
      { key: "APPOINTMENT_COMPLETION_RATE", name: "Appointment Completion Rate", category: "APPOINTMENTS", unit: "PERCENTAGE", description: "Percentage of scheduled appointments completed." },
    ],
    [
      "COMMUNICATION_ACTIVITY",
      { key: "COMMUNICATION_ACTIVITY", name: "Communication Activity Volume", category: "COMMUNICATION", unit: "COUNT", description: "Total messages dispatched across WhatsApp, Email, and SMS." },
    ],
    [
      "DOCUMENT_ACTIVITY",
      { key: "DOCUMENT_ACTIVITY", name: "Document Storage Volume", category: "DOCUMENTS", unit: "COUNT", description: "Total documents and versions stored in repository." },
    ],
  ]);

  public static getDefinition(key: string): MetricDefinition | undefined {
    return this.definitions.get(key);
  }

  public static getAllDefinitions(): MetricDefinition[] {
    return Array.from(this.definitions.values());
  }
}
