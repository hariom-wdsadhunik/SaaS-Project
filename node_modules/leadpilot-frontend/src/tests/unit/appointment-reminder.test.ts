import { supabaseAppointmentRepository } from "@/infrastructure/repositories/SupabaseAppointmentRepository";

describe("Appointment Reminder Scheduling Unit Tests", () => {
  test("scheduleReminder and getAppointmentReminders flow", async () => {
    const apps = await supabaseAppointmentRepository.getAppointments();
    const app = apps[0];

    const reminderTime = new Date(new Date(app.startTime).getTime() - 60 * 60 * 1000).toISOString();
    const reminder = await supabaseAppointmentRepository.scheduleReminder(app.id, "WHATSAPP", reminderTime);

    expect(reminder.id).toBeDefined();
    expect(reminder.appointmentId).toBe(app.id);
    expect(reminder.channel).toBe("WHATSAPP");
    expect(reminder.status).toBe("PENDING");

    const reminders = await supabaseAppointmentRepository.getAppointmentReminders(app.id);
    expect(reminders.length).toBeGreaterThan(0);
    expect(reminders.some((r) => r.id === reminder.id)).toBe(true);
  });
});
