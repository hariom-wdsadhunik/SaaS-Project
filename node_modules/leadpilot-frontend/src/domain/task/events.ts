import { AuditEvent } from "@/platform/types";
import { TaskStatus, TaskPriority } from "./types";

export interface TaskCreatedEvent extends AuditEvent {
  action: "CREATE";
  entityType: "SYSTEM";
  payload: {
    title: string;
    priority: TaskPriority;
  };
}

export interface TaskUpdatedEvent extends AuditEvent {
  action: "UPDATE";
  entityType: "SYSTEM";
  payload: {
    title: string;
  };
}

export interface TaskStatusChangedEvent extends AuditEvent {
  action: "CHANGE_STATUS";
  entityType: "SYSTEM";
  payload: {
    oldStatus: TaskStatus;
    newStatus: TaskStatus;
  };
}

export interface TaskAssignedEvent extends AuditEvent {
  action: "UPDATE";
  entityType: "SYSTEM";
  payload: {
    agentName: string;
  };
}
