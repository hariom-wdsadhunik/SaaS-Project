import { CalendarFilterState } from "@/domain/calendar/types";

export interface CalendarQueryDto extends Partial<CalendarFilterState> {
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}
