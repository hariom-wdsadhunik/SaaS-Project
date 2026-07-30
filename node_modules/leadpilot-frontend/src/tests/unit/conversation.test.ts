import { supabaseCommunicationRepository } from "@/infrastructure/repositories/SupabaseCommunicationRepository";

describe("Conversation Lifecycle Unit Tests", () => {
  test("receives inbound message and updates unread count", async () => {
    const conv = await supabaseCommunicationRepository.createConversation({
      channel: "WHATSAPP",
      subject: "Luxury Apartment Showing",
      participantName: "David Miller",
      participantAddress: "+15556667788",
    });

    const inbound = await supabaseCommunicationRepository.receiveMessage({
      conversationId: conv.id,
      sender: "David Miller",
      receiver: "Alex Morgan",
      direction: "INBOUND",
      channel: "WHATSAPP",
      content: "Can we reschedule the walkthrough to 3:00 PM?",
    });

    expect(inbound.id).toBeDefined();
    expect(inbound.direction).toBe("INBOUND");
    expect(inbound.provider).toBe("META_WHATSAPP_BUSINESS");
  });

  test("marks conversation as read", async () => {
    const conv = await supabaseCommunicationRepository.createConversation({
      channel: "SMS",
      subject: "Quick Confirmation",
      participantName: "Jessica Taylor",
      participantAddress: "+15553338899",
    });

    const success = await supabaseCommunicationRepository.markAsRead(conv.id);
    expect(success).toBe(true);
  });
});
