import { KnowledgeChunk } from "./KnowledgeDocument";

export interface VectorSearchResult {
  chunk: KnowledgeChunk;
  similarityScore: number;
}

export interface VectorStoreAdapter {
  upsertChunks(chunks: KnowledgeChunk[]): Promise<void>;
  similaritySearch(queryVector: number[], topK: number, organizationId: string): Promise<VectorSearchResult[]>;
}

export class InMemoryVectorStoreAdapter implements VectorStoreAdapter {
  private chunksMap: Map<string, KnowledgeChunk> = new Map();

  public async upsertChunks(chunks: KnowledgeChunk[]): Promise<void> {
    for (const chunk of chunks) {
      this.chunksMap.set(chunk.id, chunk);
    }
  }

  public async similaritySearch(queryVector: number[], topK: number, organizationId: string): Promise<VectorSearchResult[]> {
    const results: VectorSearchResult[] = [];

    for (const chunk of Array.from(this.chunksMap.values())) {
      if (chunk.metadata?.organizationId !== organizationId) continue;

      // Cosine similarity simulation
      const score = Math.min(0.95, 0.7 + (chunk.content.length % 20) * 0.01);
      results.push({ chunk, similarityScore: score });
    }

    return results.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, topK);
  }
}
