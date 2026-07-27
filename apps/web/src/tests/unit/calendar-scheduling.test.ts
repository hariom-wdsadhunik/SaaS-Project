import { ConflictDetectionService } from "@/domain/calendar/scheduling/ConflictDetectionService";
import { AvailabilityService } from "@/domain/calendar/scheduling/AvailabilityService";
import { CalendarEventEntity } from "@/domain/calendar/types";

describe("Calendar Scheduling Engine Unit Tests", () => {
  const existingEvents: CalendarEventEntity[] = [
    {
      id: "evt-1",
      title: "Existing Tour",
      start: "2026-07-26T10:00:00Z",
      end: "2026-07-26T11:00:00Z",
      eventType: "PROPERTY_VISIT",
      assignedAgentName: "Alex Morgan",
      status: "SCHEDULED",
      priority: "HIGH",
    },
  ];

  test("ConflictDetectionService flags overlapping timeslot", () => {
    const result = ConflictDetectionService.detectConflicts(
      "2026-07-26T10:30:00Z",
      "2026-07-26T11:30:00Z",
      existingEvents
    );
    expect(result.hasConflict).toBe(true);
    expect(result.conflictingEvents.length).toBe(1);
  });

  test("ConflictDetectionService passes clear timeslot", () => {
    const result = ConflictDetectionService.detectConflicts(
      "2026-07-26T12:00:00Z",
      "2026-07-26T13:00:00Z",
      existingEvents
    );
    expect(result.hasConflict).toBe(false);
    expect(result.conflictingEvents.length).toBe(0);
  });

  test("AvailabilityService calculates working hours correctly", () => {
    expect(AvailabilityService.isWithinWorkingHours("2026-07-26T10:00:00Z")).toBe(true);
  });
});
