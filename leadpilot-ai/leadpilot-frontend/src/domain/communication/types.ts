export type CommunicationChannel = "WHATSAPP" | "EMAIL" | "SMS" | "INTERNAL_NOTE";

export type MessageStatus = "DRAFT" | "SENT" | "DELIVERED" | "READ" | "FAILED" | "SCHEDULED";

export type ConversationStatus = "ACTIVE" | "PENDING" | "RESOLVED" | "ARCHIVED";

export interface ParticipantEntity {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  role: "AGENT" | "CUSTOMER" | "SYSTEM";
}

export interface AttachmentEntity {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
}

export interface MessageEntity {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  channel: CommunicationChannel;
  status: MessageStatus;
  attachments?: AttachmentEntity[];
  sentAt: string;
  readAt?: string;
}

export interface ConversationEntity {
  id: string;
  title: string;
  customerName: string;
  channel: CommunicationChannel;
  status: ConversationStatus;
  unreadCount: number;
  lastMessage?: string;
  lastMessageAt: string;
  isPinned: boolean;
  isArchived: boolean;
  isMuted: boolean;
  assignedAgentName: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEventEntity {
  id: string;
  conversationId: string;
  eventType: "MESSAGE_SENT" | "STATUS_CHANGED" | "NOTE_ADDED" | "CALL_LOGGED";
  description: string;
  actorName: string;
  timestamp: string;
}

export interface CommunicationFilterState {
  search: string;
  channel: string;
  status: string;
  assignedAgent: string;
  isArchived: boolean;
  isPinned: boolean;
}
