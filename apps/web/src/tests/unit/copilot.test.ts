import { LeadSummaryEngine } from "@/platform/copilot/LeadSummaryEngine";
import { EmailCopilotService } from "@/platform/copilot/EmailCopilotService";
import { WhatsAppCopilotService } from "@/platform/copilot/WhatsAppCopilotService";
import { MeetingPrepEngine } from "@/platform/copilot/MeetingPrepEngine";
import { DailyBriefEngine } from "@/platform/copilot/DailyBriefEngine";
import { DealHealthEngine } from "@/platform/copilot/DealHealthEngine";

describe("AI Sales Copilot Engine Unit Tests", () => {
  test("LeadSummaryEngine generates structured lead facts, risks & opportunities", async () => {
    const summary = await LeadSummaryEngine.generateSummary("lead-1", {
      name: "Apex Retail",
      budget: 3000000,
      location: "Commercial Core",
    });

    expect(summary.leadId).toBe("lead-1");
    expect(summary.keyFacts.length).toBeGreaterThan(0);
    expect(summary.risks.length).toBeGreaterThan(0);
    expect(summary.opportunities.length).toBeGreaterThan(0);
  });

  test("EmailCopilotService processes follow-up generation and tone adjustment", async () => {
    const res = await EmailCopilotService.processRequest({
      action: "generate_followup",
      recipientName: "Jane Doe",
    });

    expect(res.subject).toContain("Jane Doe");
    expect(res.body).toContain("Jane Doe");
    expect(res.actionTaken).toBeDefined();
  });

  test("WhatsAppCopilotService generates rapid chat replies", async () => {
    const res = await WhatsAppCopilotService.processRequest({
      action: "draft_reply",
      contactName: "John Smith",
    });

    expect(res.suggestedReply).toContain("John Smith");
  });

  test("MeetingPrepEngine complies timeline highlights and recommended talking points", async () => {
    const prep = await MeetingPrepEngine.generatePrep("lead-2", "John Doe");

    expect(prep.leadName).toBe("John Doe");
    expect(prep.recommendedTalkingPoints.length).toBeGreaterThan(0);
    expect(prep.openTasks.length).toBeGreaterThan(0);
  });

  test("DailyBriefEngine aggregates high priority leads, risk deals, and tasks due today", async () => {
    const brief = await DailyBriefEngine.generateDailyBrief("user-1");

    expect(brief.userId).toBe("user-1");
    expect(brief.highPriorityLeads.length).toBeGreaterThan(0);
    expect(brief.dealsAtRisk.length).toBeGreaterThan(0);
    expect(brief.tasksDueToday.length).toBeGreaterThan(0);
  });

  test("DealHealthEngine predicts closing probability and health grade", async () => {
    const health = await DealHealthEngine.predictHealth("deal-1", "Skyline Tower", 5000000);

    expect(health.closingProbability).toBeGreaterThan(0);
    expect(health.healthGrade).toBeDefined();
    expect(health.recommendedNextAction).toBeDefined();
  });
});
