import { TaskStatus } from "../types";
import { TaskTransitionValidator } from "./TaskTransitionValidator";
import { platformAuditLogger } from "@/platform/audit";

export const TaskWorkflowService = {
  async executeTransition(
    taskId: string,
    currentStatus: TaskStatus,
    targetStatus: TaskStatus
  ): Promise<boolean> {
    const validation = TaskTransitionValidator.validateStatusTransition(currentStatus, targetStatus);
    if (!validation.allowed) {
      throw new Error(validation.reason || "Disallowed status transition");
    }

    await new Promise((res) => setTimeout(res, 200));

    platformAuditLogger.log({
      action: "CHANGE_STATUS",
      entityType: "SYSTEM",
      entityIds: [taskId],
      payload: { fromStatus: currentStatus, toStatus: targetStatus },
      timestamp: new Date().toISOString(),
    });

    return true;
  },
};
