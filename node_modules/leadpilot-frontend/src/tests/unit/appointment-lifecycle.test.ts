import { AppointmentTransitionValidator } from "@/domain/appointment/lifecycle/AppointmentTransitionValidator";
import { AppointmentConflictService } from "@/domain/appointment/lifecycle/AppointmentConflictService";
import { AppointmentEntity } from "@/domain/appointment/types";

describe("Appointment Lifecycle Engine Unit Tests", () => {
  const existingAppointments: AppointmentEntity[] = [
    {
      id: "apt-1",
      title: "Penthouse Viewing",
      customerName: "Marcus Vance",
      propertyName: "Marina Bay #45",
      assignedAgentName: "Alex Morgan",
      start: "2026-07-26T10:00:00Z",
      end: "2026-07-26T11:00:00Z",
      status: "CONFIRMED",
      priority: "HIGH",
      appointmentType: "PROPERTY_VIEWING",
      createdAt: "2026-07-25T10:00:00Z",
      updatedAt: "2026-07-25T10:00:00Z",
    },
  ];

  test("AppointmentTransitionValidator permits SCHEDULED -> CONFIRMED", () => {
    const result = AppointmentTransitionValidator.validateTransition("SCHEDULED", "CONFIRMED");
    expect(result.allowed).toBe(true);
  });

  test("AppointmentTransitionValidator rejects COMPLETED -> SCHEDULED", () => {
    const result = AppointmentTransitionValidator.validateTransition("COMPLETED", "SCHEDULED");
    expect(result.allowed).toBe(false);
  });

  test("AppointmentConflictService flags agent overlap", () => {
    const result = AppointmentConflictService.detectConflicts(
      "2026-07-26T10:30:00Z",
      "2026-07-26T11:30:00Z",
      "Alex Morgan",
      "Other Villa",
      existingAppointments
    );
    expect(result.hasConflict).toBe(true);
  });
});
