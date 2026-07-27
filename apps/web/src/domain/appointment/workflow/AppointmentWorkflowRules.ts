import { AppointmentStatus } from "../types";

export const ALLOWED_APPOINTMENT_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  SCHEDULED: ["CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"],
  CONFIRMED: ["COMPLETED", "CANCELLED", "NO_SHOW"],
  COMPLETED: ["CANCELLED"],
  CANCELLED: ["SCHEDULED", "CONFIRMED"],
  NO_SHOW: ["SCHEDULED", "CONFIRMED"],
};

export const APPOINTMENT_WORKFLOW_RULES = {
  isValidTransition(current: AppointmentStatus, target: AppointmentStatus): boolean {
    return ALLOWED_APPOINTMENT_TRANSITIONS[current]?.includes(target) ?? false;
  },
};
