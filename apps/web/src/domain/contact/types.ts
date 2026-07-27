export type ContactStatus = "ACTIVE" | "PROSPECT" | "CLIENT" | "VIP" | "ARCHIVED" | "INACTIVE";

export interface ContactEntity {
  id: string;
  leadId?: string | null;
  fullName: string;
  avatarUrl?: string;
  jobTitle: string;
  designation?: string;
  company: string;
  companyName?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  status: ContactStatus;
  isFavorite: boolean;
  tags: string[];
  notes?: string;
  assignedAgentName: string;
  agentAvatarUrl?: string;
  lastActivity?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactFilterState {
  search: string;
  status: string;
  company: string;
  assignedAgent: string;
  tag: string;
  isFavorite?: boolean;
}

export type TimelineEventType =
  | "Lead Created"
  | "Lead Converted"
  | "Deal Created"
  | "Deal Updated"
  | "Appointment"
  | "Task"
  | "Email"
  | "WhatsApp"
  | "Notes"
  | "AI Summary";

export interface ContactTimelineEvent {
  id: string;
  contactId: string;
  eventType: TimelineEventType | string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
