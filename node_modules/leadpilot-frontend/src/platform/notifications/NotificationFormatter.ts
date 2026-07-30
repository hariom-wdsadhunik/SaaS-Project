import { DomainEvent } from "../events/DomainEvent";

export const NotificationFormatter = {
  formatFromDomainEvent(event: DomainEvent<Record<string, unknown>>): { title: string; message: string; actionUrl?: string } {
    const payload = event.payload || {};
    switch (event.eventName) {
      case "LeadCreated":
        return {
          title: "New Lead Received",
          message: `Lead "${(payload.fullName as string) || "Prospect"}" registered via ${(payload.source as string) || "Web"}.`,
          actionUrl: `/leads`,
        };
      case "TaskCompleted":
        return {
          title: "Task Concluded",
          message: `Task "${payload.title as string}" completed by ${(payload.completedBy as string) || "Agent"}.`,
          actionUrl: `/tasks`,
        };
      case "AppointmentScheduled":
        return {
          title: "Appointment Booked",
          message: `Meeting "${payload.title as string}" scheduled for ${payload.startTime as string}.`,
          actionUrl: `/appointments`,
        };
      case "DealWon":
        return {
          title: "Deal Closed & Won! 🎉",
          message: `Deal "${payload.title as string}" closed for $${((payload.value as number) || 0).toLocaleString()}.`,
          actionUrl: `/deals`,
        };
      default:
        return {
          title: `System Alert: ${event.eventName}`,
          message: `Domain event ${event.eventName} triggered for aggregate ${event.aggregateId}.`,
        };
    }
  },
};
