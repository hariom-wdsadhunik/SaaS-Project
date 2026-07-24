import { AuditEvent } from "@/platform/types";
import { PropertyStatus } from "./types";

export interface PropertyCreatedEvent extends AuditEvent {
  action: "CREATE";
  entityType: "PROPERTY";
  payload: {
    title: string;
    price: number;
    propertyType: string;
  };
}

export interface PropertyUpdatedEvent extends AuditEvent {
  action: "UPDATE";
  entityType: "PROPERTY";
  payload: {
    title: string;
    updatedFields?: string[];
  };
}

export interface PropertyAssignedEvent extends AuditEvent {
  action: "ASSIGN";
  entityType: "PROPERTY";
  payload: {
    assignedAgentName: string;
  };
}

export interface PropertyStatusChangedEvent extends AuditEvent {
  action: "CHANGE_STATUS";
  entityType: "PROPERTY";
  payload: {
    oldStatus: PropertyStatus;
    newStatus: PropertyStatus;
  };
}

export interface PropertyArchivedEvent extends AuditEvent {
  action: "ARCHIVE";
  entityType: "PROPERTY";
}

export interface PropertyDeletedEvent extends AuditEvent {
  action: "DELETE";
  entityType: "PROPERTY";
}
