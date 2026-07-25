export type TaskStatus = "TODO" | "IN_PROGRESS" | "WAITING" | "COMPLETED" | "CANCELLED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskCategory = "CALL" | "MEETING" | "EMAIL" | "FOLLOW_UP" | "CONTRACT_REVIEW" | "SITE_VISIT";

export interface TaskEntity {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string;
  assignedAgentName: string;
  agentAvatarUrl?: string;
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
}
