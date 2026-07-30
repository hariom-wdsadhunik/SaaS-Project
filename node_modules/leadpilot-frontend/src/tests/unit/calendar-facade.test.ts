import { CalendarSchedulingFacade } from "@/domain/calendar/CalendarSchedulingFacade";
import { ReminderService } from "@/domain/calendar/scheduling/ReminderService";

describe("Calendar Scheduling Facade & Reminder Engine Unit Tests", () => {
  test("ReminderService calculates offset reminder correctly", () => {
    const eventStart = "2026-07-26T10:00:00.000Z";
    const reminderIso = ReminderService.calculateReminderTime(eventStart, 15);
    expect(reminderIso).toBe("2026-07-26T09:45:00.000Z");
  });

  test("CalendarSchedulingFacade checks working hours", () => {
    expect(CalendarSchedulingFacade.checkWorkingHours("2026-07-26T10:00:00Z")).toBe(true);
  });

  test("CalendarSchedulingFacade schedules reminders", () => {
    expect(CalendarSchedulingFacade.scheduleReminder("evt-101", 30)).toBe(true);
  });
});
