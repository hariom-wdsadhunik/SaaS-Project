import { supabaseContactRepository } from "@/infrastructure/repositories/SupabaseContactRepository";
import { supabaseLeadRepository } from "@/services/supabase-lead-repository";

describe("Lead Conversion Engine Unit Tests", () => {
  test("convertLeadToContact creates Contact and preserves Lead record", async () => {
    const leadId = "ld-101";

    // 1. Fetch initial lead
    const originalLead = await supabaseLeadRepository.getLeadById(leadId);
    expect(originalLead).not.toBeNull();

    // 2. Perform lead conversion
    const result = await supabaseContactRepository.convertLeadToContact(leadId);

    // 3. Verify Contact created correctly
    expect(result.contact).toBeDefined();
    expect(result.contact.fullName).toBe(originalLead?.fullName);
    expect(result.contact.leadId).toBe(leadId);
    expect(result.contact.status).toBe("VIP");
    expect(result.contact.isFavorite).toBe(true);

    // 4. Verify original lead is preserved and updated to QUALIFIED
    const preservedLead = await supabaseLeadRepository.getLeadById(leadId);
    expect(preservedLead).not.toBeNull();
    expect(preservedLead?.id).toBe(leadId);
    expect(preservedLead?.status).toBe("QUALIFIED");

    // 5. Verify timeline events attached
    const timeline = await supabaseContactRepository.getTimelineEvents(result.contact.id);
    expect(timeline.length).toBeGreaterThanOrEqual(2);
    const eventTypes = timeline.map((t) => t.eventType);
    expect(eventTypes).toContain("Lead Created");
    expect(eventTypes).toContain("Lead Converted");
  });
});
