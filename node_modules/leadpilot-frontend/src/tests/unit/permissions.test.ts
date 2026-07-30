import { supabaseDocumentRepository } from "@/infrastructure/repositories/SupabaseDocumentRepository";

describe("Document Permissions Unit Tests", () => {
  test("shares document with specified permission level", async () => {
    const doc = await supabaseDocumentRepository.upload({
      name: "Confidential_Financial_Audit.pdf",
      mimeType: "application/pdf",
      sizeBytes: 150000,
      content: "Audit content",
    });

    const success = await supabaseDocumentRepository.share(doc.id, "agent-002", "WRITE");
    expect(success).toBe(true);
  });
});
