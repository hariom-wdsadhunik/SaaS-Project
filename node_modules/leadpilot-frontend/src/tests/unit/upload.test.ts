import { DocumentUploader } from "@/platform/storage/DocumentUploader";

describe("Document Upload Pipeline Unit Tests", () => {
  test("DocumentUploader processes file upload with checksum calculation", async () => {
    const uploadRes = await DocumentUploader.processUpload({
      fileName: "Property_Disclosure_Statement.pdf",
      mimeType: "application/pdf",
      sizeBytes: 250000,
      content: "Disclosure Content",
    });

    expect(uploadRes.success).toBe(true);
    expect(uploadRes.storagePath).toBeDefined();
    expect(uploadRes.checksum).toHaveLength(64);
  });
});
