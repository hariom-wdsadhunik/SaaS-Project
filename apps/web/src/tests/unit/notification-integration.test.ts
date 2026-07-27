import { supabaseCommunicationRepository } from "@/infrastructure/repositories/SupabaseCommunicationRepository";
import { notificationService } from "@/platform/notifications/NotificationService";

describe("Notification Integration Unit Tests", () => {
  test("receiving inbound message triggers in-app notification for assigned broker", async () => {
    const conv = await supabaseCommunicationRepository.createConversation({
      channel: "WHATSAPP",
      subject: "Urgent Offer Inquiry",
      participantName: "Alexander Wellington",
      participantAddress: "+15559990011",
      assignedAgentId: "agent-001",
    });

    await supabaseCommunicationRepository.receiveMessage({
      conversationId: conv.id,
      sender: "Alexander Wellington",
      receiver: "Alex Morgan",
      direction: "INBOUND",
      channel: "WHATSAPP",
      content: "I am ready to submit a formal counter offer of $3,600,000.",
    });

    const notifications = await notificationService.getUserNotifications("agent-001");
    expect(notifications.length).toBeGreaterThan(0);
    const whatsappAlert = notifications.find((n) => n.title.includes("WHATSAPP"));
    expect(whatsappAlert).toBeDefined();
  });
});
