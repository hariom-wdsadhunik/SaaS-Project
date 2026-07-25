import { TaskStatus } from "../types";

export const ALLOWED_TASK_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  TODO: ["IN_PROGRESS", "WAITING", "COMPLETED", "CANCELLED"],
  IN_PROGRESS: ["WAITING", "COMPLETED", "CANCELLED", "TODO"],
  WAITING: ["IN_PROGRESS", "COMPLETED", "CANCELLED"],
  COMPLETED: ["IN_PROGRESS", "CANCELLED"],
  CANCELLED: ["TODO", "IN_PROGRESS"],
};

export const TASK_WORKFLOW_RULES = {
  isValidTransition(current: TaskStatus, target: TaskStatus): boolean {
    return ALLOWED_TASK_TRANSITIONS[current]?.includes(target) ?? false;
  },
};
