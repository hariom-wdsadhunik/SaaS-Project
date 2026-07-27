import { supabaseAppointmentRepository } from "@/infrastructure/repositories/SupabaseAppointmentRepository";
import { supabaseContactRepository } from "@/infrastructure/repositories/SupabaseContactRepository";

describe("Appointment Timeline Integration Unit Tests", () => {
  test("Appointment lifecycle events auto-append to contact timeline", async () => {
    const contacts = await supabaseContactRepository.getContacts();
    const contactId = contacts[0].id;

    // 1. Create appointment linked to contact
    const app = await supabaseAppointmentRepository.createAppointment({
      title: "Commercial Property Final Lease Execution",
      description: "Final walkthrough and lease agreement signature.",
      location: "Downtown Business Centre Office 402",
      meetingType: "IN_PERSON",
      status: "SCHEDULED",
      startTime: "2026-08-01T11:00:00Z",
      endTime: "2026-08-01T12:00:00Z",
      assignedTo: "Alex Morgan",
      contactId,
    });

    // 2. Verify appointment activity recorded
    const activity = await supabaseAppointmentRepository.getAppointmentActivity(app.id);
    expect(activity.length).toBeGreaterThan(0);
    expect(activity[0].eventType).toBe("Appointment Created");

    // 3. Verify contact timeline event automatically recorded
    const contactTimeline = await supabaseContactRepository.getTimelineEvents(contactId);
    expect(contactTimeline.length).toBeGreaterThan(0);
    const appEvents = contactTimeline.filter((e) => e.eventType === "Appointment");
    expect(appEvents.length).toBeGreaterThan(0);

    // 4. Complete appointment
    await supabaseAppointmentRepository.completeAppointment(app.id);
    const updatedActivity = await supabaseAppointmentRepository.getAppointmentActivity(app.id);
    expect(updatedActivity.some((a) => a.eventType === "Completed")).toBe(true);
  });
});
