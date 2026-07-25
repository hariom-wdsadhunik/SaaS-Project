export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "RESCHEDULED";

export type AppointmentPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";

export type AppointmentType =
  | "PROPERTY_VIEWING"
  | "CLIENT_CONSULTATION"
  | "LISTING_PRESENTATION"
  | "CONTRACT_SIGNING"
  | "INSPECTION";

export interface AppointmentEntity {
  id: string;
  title: string;
  description?: string;
  customerName: string;
  propertyName: string;
  assignedAgentName: string;
  start: string;
  end: string;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  appointmentType: AppointmentType;
  source?: string;
  notes?: string;
  reminderOffsetMinutes?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFilterState {
  search: string;
  status: string;
  priority: string;
  appointmentType: string;
  assignedAgent: string;
}
