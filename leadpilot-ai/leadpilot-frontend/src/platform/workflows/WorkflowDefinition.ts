export type TriggerEvent =
  | "LeadCreated"
  | "LeadUpdated"
  | "DealWon"
  | "DealLost"
  | "AppointmentCompleted"
  | "MessageReceived"
  | "DocumentUploaded"
  | "TaskCompleted";

export type ActionType =
  | "AssignUser"
  | "CreateTask"
  | "SendNotification"
  | "SendEmail"
  | "SendWhatsApp"
  | "UpdateRecord"
  | "CreateAppointment";

export interface WorkflowCondition {
  field: string;
  operator: "EQUALS" | "NOT_EQUALS" | "CONTAINS" | "GREATER_THAN" | "LESS_THAN";
  value: unknown;
}

export interface WorkflowAction {
  id: string;
  type: ActionType;
  params: Record<string, unknown>;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  trigger: TriggerEvent;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  triggerEvent: TriggerEvent;
  status: "SUCCESS" | "FAILED" | "SKIPPED";
  executedActions: string[];
  errorMessage?: string;
  executedAt: string;
}
