import { platformAuditLogger } from "@/platform/audit";

export const TaskAutomationService = {
  async triggerRule(taskId: string, ruleName: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 250));

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "SYSTEM",
      entityIds: [taskId],
      payload: { ruleName },
      timestamp: new Date().toISOString(),
    });

    return true;
  },
};
