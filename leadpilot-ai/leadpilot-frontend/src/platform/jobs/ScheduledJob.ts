export type JobType =
  | "REMINDER_DELIVERY"
  | "WORKFLOW_EXECUTION"
  | "AI_TASK"
  | "RECURRING_APPOINTMENT"
  | "AUDIT_CLEANUP";

export type JobStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "RETRYING";

export interface ScheduledJob<TPayload = Record<string, unknown>> {
  id: string;
  type: JobType;
  payload: TPayload;
  status: JobStatus;
  runAt: string;
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export type JobHandler<T = Record<string, unknown>> = (job: ScheduledJob<T>) => Promise<void>;
