import { AppointmentEntity } from "../types";
import { AppointmentConflictService, AppointmentConflictResult } from "./AppointmentConflictService";

export const AppointmentBookingService = {
  validateBooking(
    start: string,
    end: string,
    agentName: string,
    propertyName: string,
    existingAppointments: AppointmentEntity[],
    excludeId?: string
  ): AppointmentConflictResult {
    return AppointmentConflictService.detectConflicts(
      start,
      end,
      agentName,
      propertyName,
      existingAppointments,
      excludeId
    );
  },
};
