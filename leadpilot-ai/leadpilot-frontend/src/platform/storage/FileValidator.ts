export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export class FileValidator {
  private static MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
  private static ALLOWED_MIME_TYPES = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "image/webp",
    "text/plain",
    "text/csv",
  ]);

  public static validate(fileName: string, mimeType: string, sizeBytes: number): FileValidationResult {
    if (sizeBytes > this.MAX_FILE_SIZE_BYTES) {
      return { valid: false, error: `File size exceeds 50MB ceiling limit. Provided: ${(sizeBytes / (1024 * 1024)).toFixed(2)}MB` };
    }

    if (!this.ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
      return { valid: false, error: `Unsupported MIME type: ${mimeType}. Allowed formats: PDF, DOCX, XLSX, PNG, JPEG, CSV, TXT.` };
    }

    if (!this.scanVirusPlaceholder(fileName)) {
      return { valid: false, error: "Malware security scan flag triggered for filename." };
    }

    return { valid: true };
  }

  private static scanVirusPlaceholder(fileName: string): boolean {
    const suspiciousExtensions = [".exe", ".bat", ".cmd", ".sh", ".vbs", ".msi"];
    return !suspiciousExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
  }
}
