export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type MeetingType =
  | "CALL"
  | "VIDEO"
  | "IN_PERSON"
  | "SITE_VISIT"
  | "DEMO"
  | "FOLLOW_UP";

export interface AppointmentAttendee {
  id: string;
  appointmentId: string;
  name: string;
  email: string;
  role: "ORGANIZER" | "ATTENDEE" | "GUEST";
  status: "ACCEPTED" | "DECLINED" | "TENTATIVE";
  createdAt: string;
}

export interface AppointmentReminder {
  id: string;
  appointmentId: string;
  channel: "EMAIL" | "SMS" | "WHATSAPP" | "PUSH";
  scheduledAt: string;
  sentAt?: string;
  status: "PENDING" | "SENT" | "FAILED" | "CANCELLED";
  createdAt: string;
}

export interface AppointmentEntity {
  id: string;
  title: string;
  description?: string;
  location: string;
  meetingType: MeetingType;
  status: AppointmentStatus;
  startTime: string;
  endTime: string;
  timezone: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  taskId?: string;
  createdBy: string;
  assignedTo: string;
  meetingLink?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFilterState {
  search: string;
  status: string;
  meetingType?: string;
  appointmentType?: string;
  priority?: string;
  assignedAgent?: string;
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
}

export interface AppointmentActivityEntity {
  id: string;
  appointmentId: string;
  eventType: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
