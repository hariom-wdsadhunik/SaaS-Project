import { platformAuditLogger } from "@/platform/audit";

export const AppointmentAutomationService = {
  async triggerBookingHook(appointmentId: string, eventName: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 150));

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "SYSTEM",
      entityIds: [appointmentId],
      payload: { eventName },
      timestamp: new Date().toISOString(),
    });

    return true;
  },
};
