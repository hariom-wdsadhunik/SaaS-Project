import { supabaseDocumentRepository } from "@/infrastructure/repositories/SupabaseDocumentRepository";

describe("SupabaseDocumentRepository Unit Tests", () => {
  test("upload creates document and version 1", async () => {
    const doc = await supabaseDocumentRepository.upload({
      name: "Test_Contract_Agreement.pdf",
      mimeType: "application/pdf",
      sizeBytes: 102400,
      content: "Sample Contract Content",
    });

    expect(doc.id).toBeDefined();
    expect(doc.name).toBe("Test_Contract_Agreement.pdf");
    expect(doc.currentVersion).toBe(1);
    expect(doc.checksum).toBeDefined();
  });

  test("getById returns document instance", async () => {
    const doc = await supabaseDocumentRepository.getById("d1a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d");
    expect(doc).not.toBeNull();
    expect(doc?.name).toContain("Penthouse");
  });

  test("rename updates document title", async () => {
    const doc = await supabaseDocumentRepository.upload({
      name: "Original_Name.pdf",
      mimeType: "application/pdf",
      sizeBytes: 50000,
      content: "Sample File",
    });

    const success = await supabaseDocumentRepository.rename(doc.id, "Renamed_Name.pdf");
    expect(success).toBe(true);
  });
});
