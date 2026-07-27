import { EmbeddingProvider } from "./EmbeddingProvider";
import { VectorSearchResult, VectorStoreAdapter } from "./VectorStoreAdapter";

export class KnowledgeSearch {
  private embeddingProvider: EmbeddingProvider;
  private vectorStore: VectorStoreAdapter;

  constructor(embeddingProvider: EmbeddingProvider, vectorStore: VectorStoreAdapter) {
    this.embeddingProvider = embeddingProvider;
    this.vectorStore = vectorStore;
  }

  public async search(query: string, organizationId: string, topK: number = 5): Promise<VectorSearchResult[]> {
    const queryVector = await this.embeddingProvider.embedText(query);
    return this.vectorStore.similaritySearch(queryVector, topK, organizationId);
  }
}
