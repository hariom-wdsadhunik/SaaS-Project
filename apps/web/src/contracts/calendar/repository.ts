import { CalendarEventEntity } from "@/domain/calendar/types";
import { CalendarEventFormInput } from "@/lib/validations/calendar-event-form";
import { CalendarQueryDto } from "./query.dto";

export interface CalendarRepository {
  getEvents(query?: CalendarQueryDto): Promise<CalendarEventEntity[]>;
  getEventById(id: string): Promise<CalendarEventEntity | null>;
  createEvent(input: CalendarEventFormInput): Promise<CalendarEventEntity>;
  updateEvent(id: string, input: CalendarEventFormInput): Promise<CalendarEventEntity>;
  deleteEvent(id: string): Promise<boolean>;
}
