import { StorageService } from "@/platform/storage/StorageService";
import { ChecksumValidator } from "@/platform/storage/ChecksumValidator";
import { FileValidator } from "@/platform/storage/FileValidator";

describe("Storage Subsystem Unit Tests", () => {
  test("FileValidator rejects files exceeding 50MB ceiling limit", () => {
    const res = FileValidator.validate("large.pdf", "application/pdf", 60 * 1024 * 1024);
    expect(res.valid).toBe(false);
    expect(res.error).toContain("50MB ceiling limit");
  });

  test("FileValidator rejects unallowed file extensions (.exe)", () => {
    const res = FileValidator.validate("malware.exe", "application/octet-stream", 1024);
    expect(res.valid).toBe(false);
  });

  test("ChecksumValidator calculates SHA-256 string hash", async () => {
    const hash = await ChecksumValidator.calculateSHA256("LeadPilot AI CRM Storage Stream");
    expect(hash.length).toBe(64);
  });

  test("StorageService generates signed download URLs", async () => {
    const url = await StorageService.getSignedUrl("docs/2026/07/contract.pdf", 3600);
    expect(url).toContain("signed");
  });
});
