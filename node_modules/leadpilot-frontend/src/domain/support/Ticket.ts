export type TicketStatus = "open" | "pending" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface TicketComment {
  id: string;
  ticketId: string;
  authorName: string;
  isStaff: boolean;
  content: string;
  createdAt: Date;
}

export interface Ticket {
  id: string;
  organizationId: string;
  userId: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedAgent?: string;
  comments: TicketComment[];
  createdAt: Date;
  updatedAt: Date;
}
