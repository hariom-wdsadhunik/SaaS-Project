import { WorkflowRule } from "./WorkflowRule";
import { platformAuditLogger } from "@/platform/audit";

export const WorkflowExecutor = {
  async executeRule(rule: WorkflowRule, payload: Record<string, unknown>): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 100));

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "SYSTEM",
      entityIds: [rule.id],
      payload: { ruleName: rule.name, trigger: rule.trigger, actionCount: rule.actions.length, payload },
      timestamp: new Date().toISOString(),
    });

    return true;
  },
};
