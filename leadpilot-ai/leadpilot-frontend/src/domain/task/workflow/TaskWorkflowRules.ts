import { TaskStatus } from "../types";

export const ALLOWED_TASK_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  DRAFT: ["TODO", "IN_PROGRESS", "CANCELLED", "ARCHIVED"],
  TODO: ["IN_PROGRESS", "WAITING", "COMPLETED", "CANCELLED", "ARCHIVED"],
  IN_PROGRESS: ["WAITING", "COMPLETED", "CANCELLED", "TODO", "ARCHIVED"],
  WAITING: ["IN_PROGRESS", "COMPLETED", "CANCELLED", "ARCHIVED"],
  COMPLETED: ["IN_PROGRESS", "CANCELLED", "ARCHIVED"],
  CANCELLED: ["TODO", "IN_PROGRESS", "ARCHIVED"],
  ARCHIVED: ["TODO", "IN_PROGRESS"],
};

export const TASK_WORKFLOW_RULES = {
  isValidTransition(current: TaskStatus, target: TaskStatus): boolean {
    return ALLOWED_TASK_TRANSITIONS[current]?.includes(target) ?? false;
  },
};
