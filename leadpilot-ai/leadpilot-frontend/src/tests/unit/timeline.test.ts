import { supabaseContactRepository } from "@/infrastructure/repositories/SupabaseContactRepository";

describe("Contact Timeline Engine Unit Tests", () => {
  test("appendTimelineEvent and getTimelineEvents maintain event stream", async () => {
    const contacts = await supabaseContactRepository.getContacts();
    const contactId = contacts[0].id;

    const event1 = await supabaseContactRepository.appendTimelineEvent({
      contactId,
      eventType: "Deal Created",
      title: "Penthouse Deal Initiated",
      description: "Deal dl-201 created for $3,500,000.",
      metadata: { dealId: "dl-201", amount: 3500000 },
    });

    expect(event1.id).toBeDefined();
    expect(event1.eventType).toBe("Deal Created");

    const event2 = await supabaseContactRepository.appendTimelineEvent({
      contactId,
      eventType: "Appointment",
      title: "Property Viewing Scheduled",
      description: "Scheduled VIP private showing at Palm Jumeirah.",
      metadata: { location: "Palm Jumeirah Suite A" },
    });

    expect(event2.id).toBeDefined();

    const timeline = await supabaseContactRepository.getTimelineEvents(contactId);
    expect(timeline.length).toBeGreaterThanOrEqual(2);

    const firstEvent = timeline[0];
    expect(firstEvent.contactId).toBe(contactId);
  });
});
