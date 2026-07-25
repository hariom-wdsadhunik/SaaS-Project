import { AppointmentEntity } from "@/domain/appointment/types";
import { AppointmentFormInput } from "@/lib/validations/appointment-form";
import { AppointmentQueryDto } from "./query.dto";

export interface AppointmentRepository {
  getAppointments(query?: AppointmentQueryDto): Promise<AppointmentEntity[]>;
  getAppointmentById(id: string): Promise<AppointmentEntity | null>;
  createAppointment(input: AppointmentFormInput): Promise<AppointmentEntity>;
  updateAppointment(id: string, input: AppointmentFormInput): Promise<AppointmentEntity>;
  deleteAppointment(id: string): Promise<boolean>;
}
