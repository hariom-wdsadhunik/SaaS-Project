export type TaskStatus =
  | "DRAFT"
  | "TODO"
  | "IN_PROGRESS"
  | "WAITING"
  | "COMPLETED"
  | "CANCELLED"
  | "ARCHIVED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskCategory =
  | "CALL"
  | "MEETING"
  | "EMAIL"
  | "FOLLOW_UP"
  | "CONTRACT_REVIEW"
  | "SITE_VISIT";

export interface TaskEntity {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string;
  startDate?: string;
  completedAt?: string;
  assignedAgentName: string;
  createdBy?: string;
  agentAvatarUrl?: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  reminderAt?: string;
  tags?: string[];
  relatedEntityType?: "CONTACT" | "LEAD" | "DEAL" | "PROPERTY";
  relatedEntityId?: string;
  relatedEntityName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilterState {
  search: string;
  status: string;
  priority: string;
  assignedAgent: string;
  category?: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
}

export interface TaskCommentEntity {
  id: string;
  taskId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskActivityEntity {
  id: string;
  taskId: string;
  eventType: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
