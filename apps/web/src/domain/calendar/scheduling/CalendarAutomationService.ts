import { platformAuditLogger } from "@/platform/audit";

export const CalendarAutomationService = {
  async triggerSchedulingHook(eventId: string, actionName: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 200));

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "SYSTEM",
      entityIds: [eventId],
      payload: { actionName },
      timestamp: new Date().toISOString(),
    });

    return true;
  },
};
