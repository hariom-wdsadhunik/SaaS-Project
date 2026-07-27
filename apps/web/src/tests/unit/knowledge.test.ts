import { KnowledgeRepository } from "@/domain/knowledge/KnowledgeRepository";

describe("RAG Knowledge Base Unit Tests", () => {
  test("indexes CRM content and performs similarity search", async () => {
    const doc = await KnowledgeRepository.indexKnowledge(
      "Palm Jumeirah Villa Purchase Terms",
      "The client agreed to purchase the Palm Jumeirah Beach Villa for $4.2M with a 10% deposit.",
      "NOTE",
      "org-001"
    );

    expect(doc.id).toBeDefined();
    expect(doc.chunks.length).toBeGreaterThan(0);

    const searchResults = await KnowledgeRepository.searchKnowledge("Palm Jumeirah deposit", "org-001", 3);
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults[0].similarityScore).toBeGreaterThan(0.5);
  });
});
