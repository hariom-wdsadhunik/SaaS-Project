import { AppointmentEntity, AppointmentFilterState } from "./types";
import { supabaseAppointmentRepository } from "@/infrastructure/repositories/SupabaseAppointmentRepository";
import { AppointmentConflictService, AppointmentConflictResult } from "./lifecycle/AppointmentConflictService";
import { AppointmentAvailabilityService } from "./lifecycle/AppointmentAvailabilityService";
import { AppointmentFormInput } from "@/lib/validations/appointment-form";

export const AppointmentLifecycleFacade = {
  async getAppointments(filters?: Partial<AppointmentFilterState>): Promise<AppointmentEntity[]> {
    return supabaseAppointmentRepository.getAppointments(filters);
  },

  async getAppointmentById(id: string): Promise<AppointmentEntity | null> {
    return supabaseAppointmentRepository.getAppointmentById(id);
  },

  async createAppointment(input: AppointmentFormInput): Promise<AppointmentEntity> {
    return supabaseAppointmentRepository.createAppointment(input);
  },

  async updateAppointment(id: string, input: AppointmentFormInput): Promise<AppointmentEntity> {
    return supabaseAppointmentRepository.updateAppointment(id, input);
  },

  async deleteAppointment(id: string): Promise<boolean> {
    return supabaseAppointmentRepository.deleteAppointment(id);
  },

  async confirmAppointment(id: string): Promise<AppointmentEntity> {
    return supabaseAppointmentRepository.confirmAppointment(id);
  },

  async cancelAppointment(id: string, reason?: string): Promise<AppointmentEntity> {
    return supabaseAppointmentRepository.cancelAppointment(id, reason);
  },

  async completeAppointment(id: string): Promise<AppointmentEntity> {
    return supabaseAppointmentRepository.completeAppointment(id);
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
};
