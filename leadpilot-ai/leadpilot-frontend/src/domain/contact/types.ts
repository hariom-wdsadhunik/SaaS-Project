export type ContactStatus = "ACTIVE" | "PROSPECT" | "CLIENT" | "VIP" | "INACTIVE";

export interface ContactEntity {
  id: string;
  fullName: string;
  avatarUrl?: string;
  designation: string;
  companyName: string;
  email: string;
  phone: string;
  status: ContactStatus;
  tags: string[];
  assignedAgentName: string;
  agentAvatarUrl?: string;
  lastActivity: string;
  createdAt: string;
}

export interface ContactFilterState {
  search: string;
  status: string;
  company: string;
  assignedAgent: string;
  tag: string;
}
