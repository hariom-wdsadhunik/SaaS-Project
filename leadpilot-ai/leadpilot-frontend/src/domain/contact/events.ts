import { AuditEvent } from "@/platform/types";
import { ContactStatus } from "./types";

export interface ContactCreatedEvent extends AuditEvent {
  action: "CREATE";
  entityType: "SYSTEM";
  payload: {
    fullName: string;
    email: string;
  };
}

export interface ContactUpdatedEvent extends AuditEvent {
  action: "UPDATE";
  entityType: "SYSTEM";
  payload: {
    fullName: string;
  };
}

export interface ContactStatusChangedEvent extends AuditEvent {
  action: "CHANGE_STATUS";
  entityType: "SYSTEM";
  payload: {
    oldStatus: ContactStatus;
    newStatus: ContactStatus;
  };
}
