import { MemoryRetriever } from "./MemoryRetriever";
import { MemoryIndexer } from "./MemoryIndexer";

export const MemoryService = {
  getRelevantMemory(query: string, entityId?: string): string {
    return MemoryRetriever.retrieveContext(query, entityId);
  },

  async index(documentId: string, content: string): Promise<boolean> {
    return MemoryIndexer.indexMemory(documentId, content);
  },
};
