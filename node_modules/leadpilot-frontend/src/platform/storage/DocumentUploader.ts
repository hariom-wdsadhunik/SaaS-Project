import { FileValidator } from "./FileValidator";
import { ChecksumValidator } from "./ChecksumValidator";
import { StorageService, StorageUploadResult } from "./StorageService";

export interface ManagedUploadInput {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  content: string | Blob;
  folderPath?: string;
  expectedChecksum?: string;
}

export interface ManagedUploadResult extends StorageUploadResult {
  checksum: string;
}

export class DocumentUploader {
  public static async processUpload(input: ManagedUploadInput): Promise<ManagedUploadResult> {
    const validation = FileValidator.validate(input.fileName, input.mimeType, input.sizeBytes);
    if (!validation.valid) {
      throw new Error(`[DocumentUploader] Validation failure: ${validation.error}`);
    }

    const calculatedChecksum = await ChecksumValidator.calculateSHA256(input.content);
    if (input.expectedChecksum && !ChecksumValidator.validate(calculatedChecksum, input.expectedChecksum)) {
      throw new Error(`[DocumentUploader] Checksum mismatch! Expected ${input.expectedChecksum}, calculated ${calculatedChecksum}`);
    }

    const timestamp = Date.now();
    const folder = input.folderPath || "documents/default";
    const storagePath = `${folder}/${timestamp}_${input.fileName}`;

    const uploadRes = await StorageService.uploadObject({
      storagePath,
      fileContent: input.content,
      mimeType: input.mimeType,
    });

    return {
      ...uploadRes,
      checksum: calculatedChecksum,
    };
  }
}
