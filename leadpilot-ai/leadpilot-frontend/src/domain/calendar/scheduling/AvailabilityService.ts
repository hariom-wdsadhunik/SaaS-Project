import { CalendarEventEntity } from "../types";
import { SCHEDULING_RULES } from "./SchedulingRules";

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export const AvailabilityService = {
  isWithinWorkingHours(isoDateString: string): boolean {
    const d = new Date(isoDateString);
    const hour = d.getHours();
    return hour >= SCHEDULING_RULES.workingHours.startHour && hour < SCHEDULING_RULES.workingHours.endHour;
  },

  getAvailableSlots(dateIso: string, events: CalendarEventEntity[]): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const baseDate = new Date(dateIso);
    baseDate.setHours(9, 0, 0, 0);

    for (let i = 0; i < 8; i++) {
      const slotStart = new Date(baseDate.getTime() + i * 3600000);
      const slotEnd = new Date(slotStart.getTime() + 3600000);

      const isOccupied = events.some((evt) => {
        const eStart = new Date(evt.start).getTime();
        const eEnd = new Date(evt.end).getTime();
        return slotStart.getTime() < eEnd && slotEnd.getTime() > eStart;
      });

      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        available: !isOccupied,
      });
    }

    return slots;
  },
};
