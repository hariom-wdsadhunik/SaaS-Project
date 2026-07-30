export type WorkflowTriggerType =
  | "LEAD_CREATED"
  | "LEAD_UPDATED"
  | "LEAD_ASSIGNED"
  | "DEAL_CREATED"
  | "DEAL_WON"
  | "DEAL_LOST"
  | "TASK_CREATED"
  | "TASK_COMPLETED"
  | "APPOINTMENT_CREATED"
  | "APPOINTMENT_COMPLETED"
  | "DOCUMENT_UPLOADED"
  | "COMMUNICATION_RECEIVED"
  | "USER_INVITED"
  | "BILLING_UPDATED";

export type ConditionOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "CONTAINS"
  | "GREATER_THAN"
  | "LESS_THAN"
  | "IN"
  | "NOT_IN";

export interface WorkflowCondition {
  id: string;
  field: string; // e.g. "budget", "source", "stage", "owner", "tags", "priority"
  operator: ConditionOperator;
  value: string | number | string[];
  logic?: "AND" | "OR";
}

export type ActionType =
  | "ASSIGN_LEAD"
  | "CREATE_TASK"
  | "SEND_EMAIL"
  | "SEND_WHATSAPP"
  | "SEND_SMS"
  | "MOVE_DEAL_STAGE"
  | "CREATE_NOTIFICATION"
  | "SCHEDULE_APPOINTMENT"
  | "UPDATE_LEAD"
  | "ADD_TAG"
  | "REMOVE_TAG"
  | "CALL_AI_COPILOT"
  | "WEBHOOK";

export interface WorkflowAction {
  id: string;
  type: ActionType;
  config: Record<string, string | number | boolean>;
}

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: WorkflowTriggerType;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  workflowName: string;
  trigger: WorkflowTriggerType;
  executionTime: string;
  result: "SUCCESS" | "FAILED" | "PARTIAL";
  durationMs: number;
  errors?: string[];
  retries: number;
  details: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: "LEAD_NURTURING" | "SALES_OPERATIONS" | "DEAL_MANAGEMENT" | "CUSTOMER_SUCCESS";
  trigger: WorkflowTriggerType;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
}
