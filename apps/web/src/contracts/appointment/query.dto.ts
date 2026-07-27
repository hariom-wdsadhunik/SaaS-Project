import { AppointmentFilterState } from "@/domain/appointment/types";

export interface AppointmentQueryDto extends Partial<AppointmentFilterState> {
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}
