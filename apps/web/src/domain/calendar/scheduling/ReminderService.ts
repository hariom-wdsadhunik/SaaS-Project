import { platformAuditLogger } from "@/platform/audit";

export const ReminderService = {
  calculateReminderTime(eventStartIso: string, offsetMinutes: number): string {
    const start = new Date(eventStartIso).getTime();
    const reminderTime = new Date(start - offsetMinutes * 60000);
    return reminderTime.toISOString();
  },

  scheduleReminder(eventId: string, offsetMinutes: number): boolean {
    platformAuditLogger.log({
      action: "CREATE",
      entityType: "SYSTEM",
      entityIds: [eventId],
      payload: { offsetMinutes },
      timestamp: new Date().toISOString(),
    });
    return true;
  },
};
