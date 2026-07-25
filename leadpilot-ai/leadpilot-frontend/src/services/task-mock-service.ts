import { TaskEntity, TaskFilterState } from "@/domain/task/types";
import { platformAuditLogger } from "@/platform/audit";

export const initialTasksDataset: TaskEntity[] = [
  {
    id: "tsk-501",
    title: "Schedule Penthouse Viewing Tour",
    description: "Coordinate with John Doe for Marina Bay Penthouse walkthrough.",
    status: "IN_PROGRESS",
    priority: "URGENT",
    category: "SITE_VISIT",
    dueDate: "2026-07-25T14:00:00Z",
    assignedAgentName: "Alex Morgan",
    agentAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    relatedEntityType: "PROPERTY",
    relatedEntityId: "prop-101",
    relatedEntityName: "Marina Bay Luxury Penthouse",
    createdAt: "2026-07-20T09:00:00Z",
    updatedAt: "2026-07-24T10:00:00Z",
  },
  {
    id: "tsk-502",
    title: "Send Revised SPA Contract",
    description: "Update payment schedule clause and dispatch to Sarah Jenkins.",
    status: "TODO",
    priority: "HIGH",
    category: "CONTRACT_REVIEW",
    dueDate: "2026-07-26T16:00:00Z",
    assignedAgentName: "Sarah Jenkins",
    agentAvatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    relatedEntityType: "DEAL",
    relatedEntityId: "deal-202",
    relatedEntityName: "Apex Logistics Office Expansion",
    createdAt: "2026-07-21T11:30:00Z",
    updatedAt: "2026-07-21T11:30:00Z",
  },
  {
    id: "tsk-503",
    title: "Follow up on Investment Proposal",
    description: "Call Alexander Montgomery regarding Commercial Tower portfolio terms.",
    status: "WAITING",
    priority: "MEDIUM",
    category: "FOLLOW_UP",
    dueDate: "2026-07-27T10:00:00Z",
    assignedAgentName: "Alex Morgan",
    relatedEntityType: "CONTACT",
    relatedEntityId: "cnt-303",
    relatedEntityName: "Alexander Montgomery III",
    createdAt: "2026-07-22T08:15:00Z",
    updatedAt: "2026-07-23T09:00:00Z",
  },
  {
    id: "tsk-504",
    title: "Initial Lead Qualification Call",
    description: "Contact Michael Chen for Architectural Studio requirements.",
    status: "COMPLETED",
    priority: "LOW",
    category: "CALL",
    dueDate: "2026-07-24T12:00:00Z",
    assignedAgentName: "Michael Chen",
    agentAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    relatedEntityType: "LEAD",
    relatedEntityId: "lead-104",
    relatedEntityName: "Michael Chen Lead Profile",
    createdAt: "2026-07-19T14:00:00Z",
    updatedAt: "2026-07-24T12:30:00Z",
  },
];

export const taskMockService = {
  async getTasks(filters?: Partial<TaskFilterState>): Promise<TaskEntity[]> {
    await new Promise((res) => setTimeout(res, 200));

    let items = [...initialTasksDataset];

    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            (t.description && t.description.toLowerCase().includes(q)) ||
            (t.relatedEntityName && t.relatedEntityName.toLowerCase().includes(q))
        );
      }
      if (filters.status) {
        items = items.filter((t) => t.status === filters.status);
      }
      if (filters.priority) {
        items = items.filter((t) => t.priority === filters.priority);
      }
      if (filters.assignedAgent) {
        items = items.filter((t) => t.assignedAgentName === filters.assignedAgent);
      }
    }

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "SYSTEM",
      entityIds: items.map((i) => i.id),
      payload: { filterCount: items.length },
      timestamp: new Date().toISOString(),
    });

    return items;
  },
};
