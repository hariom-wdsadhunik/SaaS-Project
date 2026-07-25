import { AppointmentEntity, AppointmentFilterState } from "./types";
import { appointmentService } from "./services/AppointmentService";
import { AppointmentConflictService, AppointmentConflictResult } from "./lifecycle/AppointmentConflictService";
import { AppointmentAvailabilityService } from "./lifecycle/AppointmentAvailabilityService";
import { AppointmentReminderService } from "./lifecycle/ReminderService";
import { AppointmentFormInput } from "@/lib/validations/appointment-form";

export const AppointmentLifecycleFacade = {
  async getAppointments(filters?: Partial<AppointmentFilterState>): Promise<AppointmentEntity[]> {
    return appointmentService.getAppointments(filters);
  },

  async createAppointment(input: AppointmentFormInput): Promise<AppointmentEntity> {
    return appointmentService.createAppointment(input);
  },

  async updateAppointment(id: string, input: AppointmentFormInput): Promise<AppointmentEntity> {
    return appointmentService.updateAppointment(id, input);
  },

  detectConflicts(
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

  checkBusinessHours(startIso: string): boolean {
    return AppointmentAvailabilityService.isWithinBusinessHours(startIso);
  },

  scheduleReminder(appointmentId: string, offsetMinutes: number): boolean {
    return AppointmentReminderService.scheduleReminder(appointmentId, offsetMinutes);
  },
};
