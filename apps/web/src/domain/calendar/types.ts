export type CalendarEventType =
  | "TASK"
  | "APPOINTMENT"
  | "MEETING"
  | "FOLLOW_UP"
  | "PROPERTY_VISIT"
  | "REMINDER"
  | "SYSTEM";

export type CalendarEventStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "IN_PROGRESS";
export type CalendarEventPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";
export type CalendarViewMode = "month" | "week" | "day" | "agenda";

export interface CalendarEventEntity {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO String
  end: string;   // ISO String
  allDay?: boolean;
  color?: string;
  eventType: CalendarEventType;
  ownerId?: string;
  assignedAgentName: string;
  relatedEntityType?: "LEAD" | "DEAL" | "PROPERTY" | "CONTACT" | "TASK";
  relatedEntityId?: string;
  relatedEntityName?: string;
  status: CalendarEventStatus;
  priority: CalendarEventPriority;
  metadata?: Record<string, unknown>;
}

export interface CalendarFilterState {
  search: string;
  eventType: string;
  priority: string;
  status: string;
  assignedAgent: string;
}
