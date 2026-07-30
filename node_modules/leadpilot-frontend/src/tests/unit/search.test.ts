import { supabaseDocumentRepository } from "@/infrastructure/repositories/SupabaseDocumentRepository";

describe("Document Search Unit Tests", () => {
  test("searches documents by query term", async () => {
    const results = await supabaseDocumentRepository.search({ search: "Penthouse" });
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });
});
