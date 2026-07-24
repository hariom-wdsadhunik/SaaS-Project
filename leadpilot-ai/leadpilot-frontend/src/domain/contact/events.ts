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

export interface ContactAssignedEvent extends AuditEvent {
  action: "UPDATE";
  entityType: "SYSTEM";
  payload: {
    agentName: string;
  };
}

export interface ContactArchivedEvent extends AuditEvent {
  action: "CHANGE_STATUS";
  entityType: "SYSTEM";
  payload: {
    contactId: string;
  };
}

export interface ContactDeletedEvent extends AuditEvent {
  action: "DELETE";
  entityType: "SYSTEM";
  payload: {
    contactId: string;
  };
}

export interface ContactMergedEvent extends AuditEvent {
  action: "UPDATE";
  entityType: "SYSTEM";
  payload: {
    sourceContactId: string;
    targetContactId: string;
  };
}

export interface RelationshipLinkedEvent extends AuditEvent {
  action: "CREATE";
  entityType: "SYSTEM";
  payload: {
    contactId: string;
    targetEntityType: "LEAD" | "DEAL" | "PROPERTY" | "DOCUMENT";
    targetEntityId: string;
  };
}

export interface RelationshipUnlinkedEvent extends AuditEvent {
  action: "DELETE";
  entityType: "SYSTEM";
  payload: {
    contactId: string;
    targetEntityType: "LEAD" | "DEAL" | "PROPERTY" | "DOCUMENT";
    targetEntityId: string;
  };
}
