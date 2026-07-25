import { CalendarEventEntity, CalendarFilterState } from "../types";
import { platformAuditLogger } from "@/platform/audit";

export const initialCalendarDataset: CalendarEventEntity[] = [
  {
    id: "evt-101",
    title: "Penthouse Viewing Tour",
    description: "Exclusive VIP walkthrough of Marina Bay Sky Villa with High-Net-Worth buyer.",
    start: "2026-07-26T10:00:00Z",
    end: "2026-07-26T11:30:00Z",
    allDay: false,
    color: "#6366f1",
    eventType: "PROPERTY_VISIT",
    assignedAgentName: "Alex Morgan",
    relatedEntityType: "PROPERTY",
    relatedEntityName: "Marina Bay Sky Villa",
    status: "SCHEDULED",
    priority: "URGENT",
  },
  {
    id: "evt-102",
    title: "Contract Review & Signoff",
    description: "Legal review meeting with conveyancing counsel for Beachfront Villa deal.",
    start: "2026-07-26T14:00:00Z",
    end: "2026-07-26T15:00:00Z",
    allDay: false,
    color: "#ec4899",
    eventType: "MEETING",
    assignedAgentName: "Sarah Jenkins",
    relatedEntityType: "DEAL",
    relatedEntityName: "Oceanfront Luxury Deal",
    status: "SCHEDULED",
    priority: "HIGH",
  },
  {
    id: "evt-103",
    title: "Client Follow-up Call",
    description: "Discuss mortgage pre-approval status with Robert Vance.",
    start: "2026-07-27T09:30:00Z",
    end: "2026-07-27T10:00:00Z",
    allDay: false,
    color: "#10b981",
    eventType: "FOLLOW_UP",
    assignedAgentName: "Alex Morgan",
    relatedEntityType: "CONTACT",
    relatedEntityName: "Robert Vance",
    status: "SCHEDULED",
    priority: "MEDIUM",
  },
  {
    id: "evt-104",
    title: "Quarterly Sales Pipeline Sync",
    description: "Team sync for Q3 targets and active deal reviews.",
    start: "2026-07-28T11:00:00Z",
    end: "2026-07-28T12:00:00Z",
    allDay: false,
    color: "#f59e0b",
    eventType: "MEETING",
    assignedAgentName: "Michael Chen",
    status: "SCHEDULED",
    priority: "HIGH",
  },
];

export const calendarEventService = {
  async getEvents(filters?: Partial<CalendarFilterState>): Promise<CalendarEventEntity[]> {
    await new Promise((res) => setTimeout(res, 200));

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "SYSTEM",
      entityIds: ["calendar-events"],
      payload: { filters },
      timestamp: new Date().toISOString(),
    });

    if (!filters) return initialCalendarDataset;

    return initialCalendarDataset.filter((evt) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!evt.title.toLowerCase().includes(q) && !evt.description?.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (filters.eventType && evt.eventType !== filters.eventType) return false;
      if (filters.priority && evt.priority !== filters.priority) return false;
      if (filters.status && evt.status !== filters.status) return false;
      if (filters.assignedAgent && evt.assignedAgentName !== filters.assignedAgent) return false;
      return true;
    });
  },
};
