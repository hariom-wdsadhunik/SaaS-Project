import { WhatsAppAssistantRequest, WhatsAppAssistantResult } from "@/domain/copilot/CopilotTypes";

export class WhatsAppCopilotService {
  public static async processRequest(req: WhatsAppAssistantRequest): Promise<WhatsAppAssistantResult> {
    const name = req.contactName || "Client";

    switch (req.action) {
      case "draft_reply":
        return {
          suggestedReply: `Hi ${name}, absolutely! I've attached the property specs right here. Let me know when you're free for a quick call. 📱`,
          summary: "Drafted instant conversational reply",
        };

      case "generate_followup":
        return {
          suggestedReply: `Hi ${name}, just checking in to see if you had a chance to look over the site plan we sent yesterday?`,
          followupPrompt: "Send in 24 hours if no reply",
        };

      case "summarize_chat":
        return {
          suggestedReply: "Chat summary: Client interested in 3-bedroom unit, requested viewing on Saturday morning.",
          summary: "Client confirmed Saturday morning availability.",
        };

      default:
        return {
          suggestedReply: `Hi ${name}, thanks for reaching out!`,
        };
    }
  }
}
