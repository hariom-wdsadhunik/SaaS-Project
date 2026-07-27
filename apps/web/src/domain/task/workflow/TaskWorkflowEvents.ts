import { AuditEvent } from "@/platform/types";
import { TaskStatus } from "../types";

export interface TaskWorkflowTransitionEvent extends AuditEvent {
  action: "CHANGE_STATUS";
  entityType: "SYSTEM";
  payload: {
    taskId: string;
    fromStatus: TaskStatus;
    toStatus: TaskStatus;
  };
}
