import { ModelRouter } from "@/domain/ai/orchestration/ModelRouter";
import { ContextBuilder } from "@/domain/ai/orchestration/ContextBuilder";
import { PromptEngine } from "@/domain/ai/orchestration/PromptEngine";
import { AIOrchestrator } from "@/domain/ai/orchestration/AIOrchestrator";

describe("AI Orchestration Layer Unit Tests", () => {
  test("ModelRouter selects appropriate model per task", () => {
    const summaryRoute = ModelRouter.route("summary");
    expect(summaryRoute.provider).toBe("OPENAI");
    expect(summaryRoute.model).toBe("gpt-4o-mini");

    const chatRoute = ModelRouter.route("chat");
    expect(chatRoute.provider).toBe("ANTHROPIC");
  });

  test("ContextBuilder builds lead and deal context strings", () => {
    const leadCtx = ContextBuilder.buildLeadContext({ name: "Eleanor Sterling", budget: 2500000 });
    expect(leadCtx).toContain("Eleanor Sterling");
    expect(leadCtx).toContain("$2500000");
  });

  test("PromptEngine assembles prompt with context", () => {
    const ctx = ContextBuilder.buildLeadContext({ name: "Marcus Vance" });
    const prompt = PromptEngine.assemblePrompt("prompt-lead-score", { leadName: "Marcus Vance", budget: "$1M", intent: "High" }, ctx);
    expect(prompt).toContain("[CRM CONTEXT - LEAD]");
    expect(prompt).toContain("Marcus Vance");
  });

  test("AIOrchestrator executes completion pipeline and normalizes response", async () => {
    const res = await AIOrchestrator.complete("Summarize luxury penthouse inquiry", "summary");
    expect(res.provider).toBe("OPENAI");
    expect(res.tokensUsed).toBeGreaterThan(0);
    expect(res.text).toContain("[LeadPilot AI Assistant]");
  });
});
