import { platformAuditLogger } from "@/platform/audit";

export const AppointmentReminderService = {
  calculateReminderTime(appointmentStartIso: string, offsetMinutes: number): string {
    const start = new Date(appointmentStartIso).getTime();
    const reminderTime = new Date(start - offsetMinutes * 60000);
    return reminderTime.toISOString();
  },

  scheduleReminder(appointmentId: string, offsetMinutes: number): boolean {
    platformAuditLogger.log({
      action: "CREATE",
      entityType: "SYSTEM",
      entityIds: [appointmentId],
      payload: { offsetMinutes },
      timestamp: new Date().toISOString(),
    });
    return true;
  },
};
