import { AppointmentLifecycleFacade } from "@/domain/appointment/AppointmentLifecycleFacade";
import { AppointmentReminderService } from "@/domain/appointment/lifecycle/ReminderService";

describe("Appointment Lifecycle Facade & Reminder Engine Unit Tests", () => {
  test("AppointmentReminderService calculates offset reminder correctly", () => {
    const aptStart = "2026-07-26T10:00:00.000Z";
    const reminderIso = AppointmentReminderService.calculateReminderTime(aptStart, 15);
    expect(reminderIso).toBe("2026-07-26T09:45:00.000Z");
  });

  test("AppointmentLifecycleFacade checks business hours", () => {
    expect(AppointmentLifecycleFacade.checkBusinessHours("2026-07-26T10:00:00Z")).toBe(true);
  });

  test("AppointmentLifecycleFacade schedules reminders", () => {
    expect(AppointmentLifecycleFacade.scheduleReminder("apt-101", 30)).toBe(true);
  });
});
