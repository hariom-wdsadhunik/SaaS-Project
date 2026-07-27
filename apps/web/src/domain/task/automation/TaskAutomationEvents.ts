import { AuditEvent } from "@/platform/types";
import { ReminderPreset } from "./TaskAutomationRules";

export interface TaskReminderScheduledEvent extends AuditEvent {
  action: "CREATE";
  entityType: "SYSTEM";
  payload: {
    taskId: string;
    preset: ReminderPreset;
  };
}

export interface TaskAutomationTriggeredEvent extends AuditEvent {
  action: "UPDATE";
  entityType: "SYSTEM";
  payload: {
    taskId: string;
    ruleName: string;
  };
}
