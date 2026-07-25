import { TaskStatus } from "../types";

export type ReminderPreset =
  | "NONE"
  | "AT_DUE"
  | "MIN_5"
  | "MIN_15"
  | "MIN_30"
  | "HOUR_1"
  | "DAY_1"
  | "CUSTOM";

export const TASK_AUTOMATION_RULES = {
  canScheduleReminder(status: TaskStatus): boolean {
    return status !== "COMPLETED" && status !== "CANCELLED";
  },
};
