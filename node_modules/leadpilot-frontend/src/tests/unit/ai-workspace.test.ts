import { AIWorkspace } from "@/domain/ai/workspace/AIWorkspace";

describe("AI Workspace Unit Tests", () => {
  test("processes conversational query and returns formatted response", async () => {
    const response = await AIWorkspace.processQuery(
      "conv-001",
      "org-001",
      "usr-001",
      "Summarize current active deals and hot leads"
    );

    expect(response.message).toBeDefined();
    expect(response.citations).toBeDefined();
    expect(response.suggestedActions?.length).toBeGreaterThan(0);
  });
});
