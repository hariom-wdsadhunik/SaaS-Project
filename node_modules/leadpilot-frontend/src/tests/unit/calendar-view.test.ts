import { supabaseAppointmentRepository } from "@/infrastructure/repositories/SupabaseAppointmentRepository";

describe("Calendar Views & Filtering Unit Tests", () => {
  test("filterAppointments filters by meetingType, status, and search query", async () => {
    const all = await supabaseAppointmentRepository.getAppointments();
    expect(all.length).toBeGreaterThan(0);

    const videoApps = await supabaseAppointmentRepository.filterAppointments({ meetingType: "VIDEO" });
    expect(videoApps.every((a) => a.meetingType === "VIDEO")).toBe(true);

    const confirmedApps = await supabaseAppointmentRepository.filterAppointments({ status: "CONFIRMED" });
    expect(confirmedApps.every((a) => a.status === "CONFIRMED")).toBe(true);

    const searchResults = await supabaseAppointmentRepository.searchAppointments("Penthouse");
    expect(searchResults.every((a) => a.title.toLowerCase().includes("penthouse") || (a.description || "").toLowerCase().includes("penthouse"))).toBe(true);
  });
});
