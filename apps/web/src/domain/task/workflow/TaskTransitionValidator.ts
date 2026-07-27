import { TaskStatus } from "../types";
import { TASK_WORKFLOW_RULES } from "./TaskWorkflowRules";

export interface TaskValidationResult {
  allowed: boolean;
  reason?: string;
}

export const TaskTransitionValidator = {
  validateStatusTransition(currentStatus: TaskStatus, targetStatus: TaskStatus): TaskValidationResult {
    if (currentStatus === targetStatus) {
      return { allowed: true };
    }

    if (!TASK_WORKFLOW_RULES.isValidTransition(currentStatus, targetStatus)) {
      return {
        allowed: false,
        reason: `Transition from "${currentStatus}" to "${targetStatus}" is disallowed by workflow policy.`,
      };
    }

    return { allowed: true };
  },
};
