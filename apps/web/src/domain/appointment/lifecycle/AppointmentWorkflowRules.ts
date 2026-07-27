import { AppointmentStatus } from "../types";

export const ALLOWED_APPOINTMENT_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  SCHEDULED: ["CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"],
  CONFIRMED: ["COMPLETED", "CANCELLED", "NO_SHOW"],
  COMPLETED: ["CANCELLED"],
  CANCELLED: ["SCHEDULED", "CONFIRMED"],
  NO_SHOW: ["SCHEDULED", "CONFIRMED"],
};
