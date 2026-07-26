import { StorageService } from "./StorageService";

export class DocumentDownloader {
  public static async generateDownloadUrl(storagePath: string, expiresInSeconds: number = 1800): Promise<string> {
    return StorageService.getSignedUrl(storagePath, expiresInSeconds);
  }

  public static async fetchContentMock(storagePath: string): Promise<string> {
    return `[Mock Storage Payload Stream for path: ${storagePath}]`;
  }
}
