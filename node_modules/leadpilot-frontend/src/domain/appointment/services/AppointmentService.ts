import { supabaseAppointmentRepository } from "@/infrastructure/repositories/SupabaseAppointmentRepository";
import { AppointmentEntity, AppointmentFilterState } from "../types";
import { AppointmentFormInput } from "@/lib/validations/appointment-form";

export const appointmentService = {
  async getAppointments(filters?: Partial<AppointmentFilterState>): Promise<AppointmentEntity[]> {
    if (filters && Object.keys(filters).length > 0) {
      return supabaseAppointmentRepository.filterAppointments(filters);
    }
    return supabaseAppointmentRepository.getAppointments();
  },

  async createAppointment(input: AppointmentFormInput): Promise<AppointmentEntity> {
    return supabaseAppointmentRepository.createAppointment(input);
  },

  async updateAppointment(id: string, input: AppointmentFormInput): Promise<AppointmentEntity> {
    return supabaseAppointmentRepository.updateAppointment(id, input);
  },
};
