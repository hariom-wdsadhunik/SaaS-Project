import { ConversationMemory } from "./ConversationMemory";
import { BusinessMemory } from "./BusinessMemory";
import { KnowledgeMemory } from "./KnowledgeMemory";
import { MemoryRanking, MemoryRecord } from "./MemoryRanking";

export const MemoryRetriever = {
  retrieveContext(query: string, entityId: string = "lead-1"): string {
    const conv = ConversationMemory.getMemory("conv-1");
    const biz = BusinessMemory.getBusinessMemory(entityId);
    const docs = KnowledgeMemory.getKnowledgeSnippets();

    const unranked: MemoryRecord[] = [
      { id: "mem-1", text: `[CONVERSATION SUMMARY] ${conv.summary}`, relevanceScore: 0.95 },
      { id: "mem-2", text: `[BUSINESS FACTS] ${biz.keyFacts.join(" | ")}`, relevanceScore: 0.92 },
      { id: "mem-3", text: `[PLAYBOOK] ${docs[1].snippet}`, relevanceScore: 0.88 },
    ];

    const ranked = MemoryRanking.rankRecords(unranked, 3);
    return ranked.map((r) => r.text).join("\n");
  },
};
