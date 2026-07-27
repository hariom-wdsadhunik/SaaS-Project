import { AuditEvent } from "@/platform/types";

export interface CalendarEventCreatedEvent extends AuditEvent {
  action: "CREATE";
  entityType: "SYSTEM";
  payload: { eventId: string; title: string; eventType: string };
}

export interface CalendarEventUpdatedEvent extends AuditEvent {
  action: "UPDATE";
  entityType: "SYSTEM";
  payload: { eventId: string; updatedFields: string[] };
}

export interface CalendarEventDeletedEvent extends AuditEvent {
  action: "DELETE";
  entityType: "SYSTEM";
  payload: { eventId: string };
}

export interface ReminderScheduledEvent extends AuditEvent {
  action: "CREATE";
  entityType: "SYSTEM";
  payload: { eventId: string; offsetMinutes: number };
}
