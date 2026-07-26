import {
  AppointmentActivityEntity,
  AppointmentAttendee,
  AppointmentEntity,
  AppointmentFilterState,
  AppointmentReminder,
} from "@/domain/appointment/types";
import { AppointmentFormInput } from "@/lib/validations/appointment-form";

export interface AppointmentRepository {
  getAppointments(filters?: Partial<AppointmentFilterState>): Promise<AppointmentEntity[]>;
  getAppointmentById(id: string): Promise<AppointmentEntity | null>;
  createAppointment(input: AppointmentFormInput): Promise<AppointmentEntity>;
  updateAppointment(id: string, input: AppointmentFormInput): Promise<AppointmentEntity>;
  deleteAppointment(id: string): Promise<boolean>;
  confirmAppointment(id: string): Promise<AppointmentEntity>;
  cancelAppointment(id: string, reason?: string): Promise<AppointmentEntity>;
  completeAppointment(id: string): Promise<AppointmentEntity>;
  searchAppointments(query: string): Promise<AppointmentEntity[]>;
  filterAppointments(filters: Partial<AppointmentFilterState>): Promise<AppointmentEntity[]>;
  getAppointmentActivity(appointmentId: string): Promise<AppointmentActivityEntity[]>;
  getAppointmentAttendees(appointmentId: string): Promise<AppointmentAttendee[]>;
  getAppointmentReminders(appointmentId: string): Promise<AppointmentReminder[]>;
  scheduleReminder(
    appointmentId: string,
    channel: "EMAIL" | "SMS" | "WHATSAPP" | "PUSH",
    scheduledAt: string
  ): Promise<AppointmentReminder>;
}
