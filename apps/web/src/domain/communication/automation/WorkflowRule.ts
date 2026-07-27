export type WorkflowTriggerType =
  | "LeadCreated"
  | "LeadAssigned"
  | "LeadQualified"
  | "DealCreated"
  | "DealWon"
  | "DealLost"
  | "AppointmentScheduled"
  | "AppointmentConfirmed"
  | "AppointmentCompleted"
  | "TaskAssigned"
  | "TaskCompleted";

export type WorkflowActionType =
  | "SendMessage"
  | "CreateInternalNote"
  | "ApplyTemplate"
  | "CreateTimelineEvent"
  | "ScheduleMessage";

export interface WorkflowAction {
  type: WorkflowActionType;
  params: Record<string, unknown>;
}

export interface WorkflowRule {
  id: string;
  name: string;
  trigger: WorkflowTriggerType;
  conditions?: Record<string, unknown>;
  actions: WorkflowAction[];
  priority: number;
  enabled: boolean;
}
