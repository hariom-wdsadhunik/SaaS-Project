import { AuditEvent } from "@/platform/types";

export interface ConversationCreatedEvent extends AuditEvent {
  action: "CREATE";
  entityType: "SYSTEM";
  payload: { conversationId: string; title: string; channel: string };
}

export interface MessageSentEvent extends AuditEvent {
  action: "CREATE";
  entityType: "SYSTEM";
  payload: { messageId: string; conversationId: string; channel: string };
}

export interface ConversationArchivedEvent extends AuditEvent {
  action: "UPDATE";
  entityType: "SYSTEM";
  payload: { conversationId: string; isArchived: boolean };
}
