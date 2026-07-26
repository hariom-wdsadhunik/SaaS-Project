import { KnowledgeDocument, KnowledgeSourceType } from "./KnowledgeDocument";
import { KnowledgeIndexer } from "./KnowledgeIndexer";
import { KnowledgeSearch } from "./KnowledgeSearch";
import { MockEmbeddingProvider } from "./EmbeddingProvider";
import { InMemoryVectorStoreAdapter, VectorSearchResult } from "./VectorStoreAdapter";

export class KnowledgeRepository {
  private static embeddingProvider = new MockEmbeddingProvider();
  private static vectorStore = new InMemoryVectorStoreAdapter();
  private static indexer = new KnowledgeIndexer(this.embeddingProvider, this.vectorStore);
  private static searchEngine = new KnowledgeSearch(this.embeddingProvider, this.vectorStore);

  public static async indexKnowledge(
    title: string,
    content: string,
    sourceType: KnowledgeSourceType,
    organizationId: string,
    sourceEntityId?: string
  ): Promise<KnowledgeDocument> {
    return this.indexer.indexContent(title, content, sourceType, organizationId, sourceEntityId);
  }

  public static async searchKnowledge(query: string, organizationId: string, topK: number = 5): Promise<VectorSearchResult[]> {
    return this.searchEngine.search(query, organizationId, topK);
  }
}
