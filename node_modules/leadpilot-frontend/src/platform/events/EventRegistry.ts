export const DOMAIN_EVENTS = {
  LEAD_CREATED: "LeadCreated",
  LEAD_UPDATED: "LeadUpdated",
  CONTACT_CREATED: "ContactCreated",
  TASK_COMPLETED: "TaskCompleted",
  APPOINTMENT_SCHEDULED: "AppointmentScheduled",
  DEAL_WON: "DealWon",
  DEAL_UPDATED: "DealUpdated",
} as const;

export type DomainEventName = (typeof DOMAIN_EVENTS)[keyof typeof DOMAIN_EVENTS];

export interface LeadCreatedPayload {
  leadId: string;
  fullName: string;
  email: string;
  source: string;
}

export interface LeadUpdatedPayload {
  leadId: string;
  status: string;
  score?: number;
}

export interface ContactCreatedPayload {
  contactId: string;
  fullName: string;
  email: string;
}

export interface TaskCompletedPayload {
  taskId: string;
  title: string;
  completedBy: string;
}

export interface AppointmentScheduledPayload {
  appointmentId: string;
  title: string;
  startTime: string;
  assignedTo: string;
}

export interface DealWonPayload {
  dealId: string;
  title: string;
  value: number;
}
