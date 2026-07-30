export type MetricName =
  | "users"
  | "leads"
  | "deals"
  | "storage_mb"
  | "ai_requests"
  | "workflow_executions"
  | "documents"
  | "messages";

export interface UsageRecord {
  id: string;
  organizationId: string;
  metric: MetricName;
  quantity: number;
  recordedAt: Date;
}
