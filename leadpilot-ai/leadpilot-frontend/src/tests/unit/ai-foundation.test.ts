import { TokenEstimator } from "@/domain/ai/services/TokenEstimator";
import { PromptService } from "@/domain/ai/services/PromptService";
import { CompletionService } from "@/domain/ai/services/CompletionService";

describe("AI Foundation Unit Tests", () => {
  test("TokenEstimator estimates tokens accurately", () => {
    const text = "Hello world this is a test prompt";
    const tokens = TokenEstimator.estimateTokens(text);
    expect(tokens).toBe(9);
  });

  test("PromptService renders template variables", () => {
    const templates = PromptService.getTemplates();
    const rendered = PromptService.renderPrompt(templates[0], {
      leadName: "Marcus Vance",
      budget: "$5,000,000",
      intent: "High",
    });
    expect(rendered).toContain("Marcus Vance");
    expect(rendered).toContain("$5,000,000");
  });

  test("CompletionService returns mock AI completion", async () => {
    const res = await CompletionService.generateCompletion({
      provider: "OPENAI",
      model: "gpt-4o",
      prompt: "Qualify lead Marcus Vance",
    });
    expect(res.provider).toBe("OPENAI");
    expect(res.content).toContain("[LeadPilot AI Assistant]");
    expect(res.usage.totalTokens).toBeGreaterThan(0);
  });
});
