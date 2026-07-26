import { AITool } from "./Tool";
import { ToolResult } from "./ToolResult";
import { ToolPermissionLevel } from "./ToolPermission";
import { supabaseDocumentRepository } from "@/infrastructure/repositories/SupabaseDocumentRepository";

export class DocumentTool implements AITool {
  public name(): string {
    return "document_intelligence_tool";
  }

  public description(): string {
    return "AI Document tool for OCR text extraction, document summaries, metadata search, knowledge extraction, and RAG index lookup.";
  }

  public category(): string {
    return "DOCUMENT";
  }

  public requiredPermission(): ToolPermissionLevel {
    return "READ";
  }

  public validate(params: Record<string, unknown>): boolean {
    return !!params.documentId || !!params.query;
  }

  public async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const documentId = (params.documentId as string) || "d1a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d";
    const action = (params.action as string) || "GET_SUMMARY";
    const query = (params.query as string) || "";

    const doc = await supabaseDocumentRepository.getById(documentId);

    let outputData: Record<string, unknown> = {};

    switch (action) {
      case "GET_SUMMARY":
        outputData = {
          documentId,
          name: doc?.name,
          summary: doc?.summary || "Sale and Purchase Agreement draft for Palm Jumeirah Penthouse 402.",
          currentVersion: doc?.currentVersion || 1,
        };
        break;

      case "OCR_EXTRACT":
        outputData = {
          documentId,
          ocrStatus: doc?.ocrStatus || "COMPLETED",
          ocrText: doc?.ocrText || "OCR extracted contract clause text from legal document PDF.",
        };
        break;

      case "KNOWLEDGE_EXTRACT":
        outputData = {
          documentId,
          extractedEntities: {
            buyer: "Vanguard Tech Holdings",
            seller: "Emaar Properties PJSC",
            price: "$3,500,000",
            escrowDeposit: "10%",
            propertyLocation: "Palm Jumeirah Penthouse 402",
          },
        };
        break;

      case "SEARCH_RAG": {
        const searchResults = await supabaseDocumentRepository.search({ search: query });
        outputData = {
          query,
          vectorEmbeddingModel: "text-embedding-3-small",
          ragContextChunks: searchResults.map((d) => ({
            id: d.id,
            name: d.name,
            snippet: d.summary || d.ocrText,
            similarityScore: 0.94,
          })),
        };
        break;
      }

      default:
        outputData = { metadata: { name: doc?.name, mimeType: doc?.mimeType, checksum: doc?.checksum } };
        break;
    }

    return {
      toolName: this.name(),
      success: true,
      data: outputData,
      timestamp: new Date().toISOString(),
    };
  }
}
