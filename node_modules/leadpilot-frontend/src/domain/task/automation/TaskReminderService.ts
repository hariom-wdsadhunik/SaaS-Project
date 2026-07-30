import { TaskStatus } from "../types";
import { ReminderPreset, TASK_AUTOMATION_RULES } from "./TaskAutomationRules";
import { platformAuditLogger } from "@/platform/audit";

export const TaskReminderService = {
  async scheduleReminder(taskId: string, status: TaskStatus, preset: ReminderPreset): Promise<boolean> {
    if (!TASK_AUTOMATION_RULES.canScheduleReminder(status)) {
      throw new Error(`Cannot schedule reminders for tasks in ${status} status.`);
    }

    await new Promise((res) => setTimeout(res, 200));

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "SYSTEM",
      entityIds: [taskId],
      payload: { preset },
      timestamp: new Date().toISOString(),
    });

    return true;
  },
};
