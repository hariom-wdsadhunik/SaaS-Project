import { CalendarEventEntity, CalendarFilterState } from "./types";
import { calendarEventService } from "./services/CalendarEventService";
import { ConflictDetectionService, ConflictResult } from "./scheduling/ConflictDetectionService";
import { AvailabilityService } from "./scheduling/AvailabilityService";
import { ReminderService } from "./scheduling/ReminderService";
import { CalendarEventFormInput } from "@/lib/validations/calendar-event-form";

export const CalendarSchedulingFacade = {
  async getEvents(filters?: Partial<CalendarFilterState>): Promise<CalendarEventEntity[]> {
    return calendarEventService.getEvents(filters);
  },

  async createEvent(input: CalendarEventFormInput): Promise<CalendarEventEntity> {
    return calendarEventService.createEvent(input);
  },

  async updateEvent(id: string, input: CalendarEventFormInput): Promise<CalendarEventEntity> {
    return calendarEventService.updateEvent(id, input);
  },

  detectConflicts(
    start: string,
    end: string,
    existingEvents: CalendarEventEntity[],
    excludeId?: string
  ): ConflictResult {
    return ConflictDetectionService.detectConflicts(start, end, existingEvents, excludeId);
  },

  checkWorkingHours(startIso: string): boolean {
    return AvailabilityService.isWithinWorkingHours(startIso);
  },

  scheduleReminder(eventId: string, offsetMinutes: number): boolean {
    return ReminderService.scheduleReminder(eventId, offsetMinutes);
  },
};
