import { DocumentPreview } from "@/domain/documents/types";

export class DocumentPreviewGenerator {
  public static async generatePreview(documentId: string, storagePath: string, mimeType: string): Promise<DocumentPreview> {
    const isImage = mimeType.startsWith("image/");
    const isPdf = mimeType === "application/pdf";

    const previewType = isImage ? "IMAGE" : isPdf ? "PDF" : "TEXT";
    const previewUrl = `https://storage.leadpilot.ai/previews/${documentId}/view.${isImage ? "jpg" : "pdf"}`;
    const thumbnailUrl = `https://storage.leadpilot.ai/previews/${documentId}/thumb.jpg`;

    return {
      id: `prv-${Date.now()}`,
      documentId,
      previewUrl,
      thumbnailUrl,
      previewType,
      status: "READY",
      createdAt: new Date().toISOString(),
    };
  }
}
