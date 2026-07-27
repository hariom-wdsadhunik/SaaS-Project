import { supabaseCommunicationRepository } from "@/infrastructure/repositories/SupabaseCommunicationRepository";

describe("SupabaseCommunicationRepository Unit Tests", () => {
  test("createConversation creates and returns conversation instance", async () => {
    const conv = await supabaseCommunicationRepository.createConversation({
      channel: "WHATSAPP",
      subject: "Penthouse Walkthrough Follow-up",
      participantName: "Marcus Vance",
      participantAddress: "+15552345678",
      assignedAgentId: "agent-001",
    });

    expect(conv.id).toBeDefined();
    expect(conv.channel).toBe("WHATSAPP");
    expect(conv.status).toBe("ACTIVE");
  });

  test("sendMessage dispatches message and returns record", async () => {
    const conv = await supabaseCommunicationRepository.createConversation({
      channel: "EMAIL",
      subject: "Draft Purchase Agreement Review",
      participantName: "Eleanor Sterling",
      participantAddress: "eleanor@sterling.com",
    });

    const msg = await supabaseCommunicationRepository.sendMessage({
      conversationId: conv.id,
      sender: "Alex Morgan",
      receiver: "Eleanor Sterling",
      direction: "OUTBOUND",
      channel: "EMAIL",
      content: "Please find attached the draft purchase agreement.",
    });

    expect(msg.id).toBeDefined();
    expect(msg.direction).toBe("OUTBOUND");
    expect(msg.channel).toBe("EMAIL");
    expect(msg.provider).toBe("SENDGRID_EMAIL");
  });

  test("archiveConversation updates conversation status", async () => {
    const conv = await supabaseCommunicationRepository.createConversation({
      channel: "SMS",
      subject: "Temporary SMS Thread",
      participantName: "Client Rep",
      participantAddress: "+15550001122",
    });

    const success = await supabaseCommunicationRepository.archiveConversation(conv.id);
    expect(success).toBe(true);
  });
});
