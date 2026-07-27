import { EmailAssistantRequest, EmailAssistantResult } from "@/domain/copilot/CopilotTypes";

export class EmailCopilotService {
  public static async processRequest(req: EmailAssistantRequest): Promise<EmailAssistantResult> {
    const name = req.recipientName || "Valued Client";
    const tone = req.tone || "professional";

    switch (req.action) {
      case "generate_followup":
        return {
          subject: `Following up on our recent property walkthrough — ${name}`,
          body: `Hi ${name},\n\nThank you for taking the time to review the commercial listings with us yesterday. I wanted to follow up and see if you have any questions regarding the floor plan or financial projections.\n\nPlease let me know if you would like to schedule a follow-up call this week.\n\nBest regards,\nLeadPilot Advisory Team`,
          actionTaken: "Generated follow-up email draft",
        };

      case "rewrite":
      case "change_tone":
        return {
          subject: `Updated Proposal Review`,
          body: tone === "friendly" 
            ? `Hey ${name}! Hope you're having a great week! Just wanted to share the updated details with you.`
            : `Dear ${name},\n\nPlease find attached the updated executive summary and commercial terms for your review.`,
          actionTaken: `Rewrote message with ${tone} tone`,
        };

      case "summarize_thread":
        return {
          body: "Thread Summary: Client confirmed budget of $3.5M, requested HVAC inspection reports, and agreed to next milestone on Friday.",
          summary: "3 emails exchanged. Main blocker: HVAC report request.",
          actionTaken: "Summarized email thread history",
        };

      default:
        return {
          body: "Standard communication draft.",
          actionTaken: "Default process",
        };
    }
  }
}
