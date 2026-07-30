import { supabaseDocumentRepository } from "@/infrastructure/repositories/SupabaseDocumentRepository";

describe("Document Versioning Unit Tests", () => {
  test("createVersion increments document version number", async () => {
    const doc = await supabaseDocumentRepository.upload({
      name: "Versioned_Contract.pdf",
      mimeType: "application/pdf",
      sizeBytes: 100000,
      content: "Version 1 Content",
    });

    const newVersion = await supabaseDocumentRepository.createVersion(doc.id, {
      content: "Version 2 Content with updated escrow clause",
      sizeBytes: 110000,
      changeSummary: "Updated escrow deposit terms",
    });

    expect(newVersion.versionNumber).toBe(2);
    expect(newVersion.changeSummary).toBe("Updated escrow deposit terms");
  });
});
