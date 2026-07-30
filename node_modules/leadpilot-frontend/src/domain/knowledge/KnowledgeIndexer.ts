import { KnowledgeChunk, KnowledgeDocument, KnowledgeSourceType } from "./KnowledgeDocument";
import { EmbeddingProvider } from "./EmbeddingProvider";
import { VectorStoreAdapter } from "./VectorStoreAdapter";

export class KnowledgeIndexer {
  private embeddingProvider: EmbeddingProvider;
  private vectorStore: VectorStoreAdapter;

  constructor(embeddingProvider: EmbeddingProvider, vectorStore: VectorStoreAdapter) {
    this.embeddingProvider = embeddingProvider;
    this.vectorStore = vectorStore;
  }

  public async indexContent(
    title: string,
    content: string,
    sourceType: KnowledgeSourceType,
    organizationId: string,
    sourceEntityId?: string
  ): Promise<KnowledgeDocument> {
    const docId = `kdoc-${Date.now()}`;
    const rawChunks = this.chunkText(content, 300);

    const chunks: KnowledgeChunk[] = [];
    for (let i = 0; i < rawChunks.length; i++) {
      const chunkText = rawChunks[i];
      const vector = await this.embeddingProvider.embedText(chunkText);

      chunks.push({
        id: `chk-${docId}-${i}`,
        documentId: docId,
        chunkIndex: i,
        content: chunkText,
        vector,
        metadata: { organizationId, sourceType, sourceEntityId, title },
      });
    }

    await this.vectorStore.upsertChunks(chunks);

    return {
      id: docId,
      title,
      sourceType,
      sourceEntityId,
      organizationId,
      chunks,
      indexedAt: new Date().toISOString(),
    };
  }

  private chunkText(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
      chunks.push(text.slice(start, start + chunkSize));
      start += chunkSize - 50; // 50 char overlap
    }
    return chunks.length > 0 ? chunks : [text];
  }
}
