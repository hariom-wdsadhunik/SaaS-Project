import { AuditEvent } from "@/platform/types";

export interface AppointmentBookedEvent extends AuditEvent {
  action: "CREATE";
  entityType: "SYSTEM";
  payload: { appointmentId: string; title: string };
}

export interface AppointmentStatusChangedEvent extends AuditEvent {
  action: "CHANGE_STATUS";
  entityType: "SYSTEM";
  payload: { appointmentId: string; from: string; to: string };
}
