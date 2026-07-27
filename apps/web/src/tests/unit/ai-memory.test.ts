import { MemoryService } from "@/domain/ai/memory/MemoryService";
import { MemoryRanking } from "@/domain/ai/memory/MemoryRanking";
import { AIOrchestrator } from "@/domain/ai/orchestration/AIOrchestrator";

describe("AI Memory & Knowledge Engine Unit Tests", () => {
  test("MemoryService retrieves ranked relevant memory context", () => {
    const memory = MemoryService.getRelevantMemory("Marcus Vance penthouse budget");
    expect(memory).toContain("[CONVERSATION SUMMARY]");
    expect(memory).toContain("Marcus Vance");
    expect(memory).toContain("[PLAYBOOK]");
  });

  test("MemoryRanking ranks records by relevance score", () => {
    const unranked = [
      { id: "1", text: "Low relevance", relevanceScore: 0.2 },
      { id: "2", text: "High relevance", relevanceScore: 0.99 },
    ];

    const ranked = MemoryRanking.rankRecords(unranked, 1);
    expect(ranked.length).toBe(1);
    expect(ranked[0].id).toBe("2");
  });

  test("AIOrchestrator enriches completion requests with memory context", async () => {
    const res = await AIOrchestrator.complete("Draft VIP WhatsApp for Marcus Vance", "completion");
    expect(res.text).toContain("[LeadPilot AI Assistant]");
    expect(res.tokensUsed).toBeGreaterThan(0);
  });
});
