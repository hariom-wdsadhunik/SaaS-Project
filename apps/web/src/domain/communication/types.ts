export type CommunicationChannel = "WHATSAPP" | "EMAIL" | "SMS" | "IN_APP" | "INTERNAL_NOTE";

export type MessageDirection = "INBOUND" | "OUTBOUND";

export type MessageStatus = "QUEUED" | "SENT" | "DELIVERED" | "READ" | "FAILED";

export type ConversationStatus = "ACTIVE" | "ARCHIVED" | "CLOSED" | "PENDING";

export interface Participant {
  id: string;
  conversationId: string;
  name: string;
  address: string;
  role: "CLIENT" | "AGENT" | "SYSTEM";
  createdAt: string;
}

export interface Attachment {
  id: string;
  messageId: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  fileUrl: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender?: string;
  receiver?: string;
  direction?: MessageDirection;
  channel: CommunicationChannel;
  content: string;
  status: MessageStatus;
  provider?: string;
  providerMessageId?: string;
  senderId?: string;
  senderName?: string;
  sentAt?: string;
  attachments?: Attachment[];
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

export type MessageEntity = Message;

export interface Conversation {
  id: string;
  channel: CommunicationChannel;
  title?: string;
  subject?: string;
  status: ConversationStatus;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  unreadCount: number;
  lastMessageAt: string;
  customerName?: string;
  lastMessage?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  isMuted?: boolean;
  participants?: Participant[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type ConversationEntity = Conversation;

export interface TimelineEventEntity {
  id: string;
  conversationId: string;
  eventType: string;
  description: string;
  actorName: string;
  timestamp: string;
}

export interface CommunicationFilterState {
  search: string;
  channel: string;
  status: string;
  assignedAgent: string;
  isArchived?: boolean;
  isPinned?: boolean;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: "PROSPECTING" | "FOLLOW_UP" | "CLOSING" | "APPOINTMENT_REMINDER" | "GENERAL";
  channel: CommunicationChannel;
  subjectTemplate?: string;
  bodyTemplate: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryReceipt {
  id: string;
  messageId: string;
  status: "DELIVERED" | "READ" | "FAILED";
  providerStatusCode?: string;
  timestamp: string;
  createdAt: string;
}

export interface ConversationSummary {
  conversationId: string;
  totalMessages: number;
  lastSender: string;
  lastContent: string;
  channel: CommunicationChannel;
  unreadCount: number;
  sentimentPlaceholder: "POSITIVE" | "NEUTRAL" | "URGENT";
}
