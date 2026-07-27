import { CalendarEventEntity } from "@/domain/calendar/types";
import { ApiResponse } from "../shared/api-response.dto";

export type CalendarEventResponseDto = ApiResponse<CalendarEventEntity>;
export type CalendarEventListResponseDto = ApiResponse<CalendarEventEntity[]>;
