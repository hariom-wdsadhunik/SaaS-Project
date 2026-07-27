import { supabaseAppointmentRepository } from "@/infrastructure/repositories/SupabaseAppointmentRepository";

describe("SupabaseAppointmentRepository Unit Tests", () => {
  test("getAppointments returns list of appointments", async () => {
    const apps = await supabaseAppointmentRepository.getAppointments();
    expect(Array.isArray(apps)).toBe(true);
    expect(apps.length).toBeGreaterThan(0);
  });

  test("getAppointmentById retrieves specific appointment record", async () => {
    const apps = await supabaseAppointmentRepository.getAppointments();
    const firstId = apps[0].id;
    const app = await supabaseAppointmentRepository.getAppointmentById(firstId);
    expect(app).not.toBeNull();
    expect(app?.id).toBe(firstId);
  });

  test("createAppointment creates and persists new appointment", async () => {
    const created = await supabaseAppointmentRepository.createAppointment({
      title: "Q3 Investment Strategy Review",
      description: "Review real estate portfolio options with high net worth buyer.",
      location: "HQ Executive Boardroom A",
      meetingType: "IN_PERSON",
      status: "SCHEDULED",
      startTime: "2026-07-30T10:00:00Z",
      endTime: "2026-07-30T11:00:00Z",
      assignedTo: "Alex Morgan",
    });

    expect(created.id).toBeDefined();
    expect(created.title).toBe("Q3 Investment Strategy Review");
    expect(created.meetingType).toBe("IN_PERSON");

    const fetched = await supabaseAppointmentRepository.getAppointmentById(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.title).toBe("Q3 Investment Strategy Review");
  });

  test("confirmAppointment, completeAppointment, and cancelAppointment lifecycle", async () => {
    const apps = await supabaseAppointmentRepository.getAppointments();
    const testId = apps[0].id;

    const confirmed = await supabaseAppointmentRepository.confirmAppointment(testId);
    expect(confirmed.status).toBe("CONFIRMED");

    const completed = await supabaseAppointmentRepository.completeAppointment(testId);
    expect(completed.status).toBe("COMPLETED");

    const cancelled = await supabaseAppointmentRepository.cancelAppointment(testId, "Client rescheduled.");
    expect(cancelled.status).toBe("CANCELLED");
  });

  test("deleteAppointment removes appointment record", async () => {
    const temp = await supabaseAppointmentRepository.createAppointment({
      title: "Temporary Meeting to Delete",
      location: "Online",
      meetingType: "CALL",
      status: "SCHEDULED",
      startTime: "2026-08-05T14:00:00Z",
      endTime: "2026-08-05T14:30:00Z",
      assignedTo: "Sarah Jenkins",
    });

    const deleted = await supabaseAppointmentRepository.deleteAppointment(temp.id);
    expect(deleted).toBe(true);

    const fetched = await supabaseAppointmentRepository.getAppointmentById(temp.id);
    expect(fetched).toBeNull();
  });
});
