import { platformAuditLogger } from "@/platform/audit";

export const MemoryIndexer = {
  async indexMemory(documentId: string, content: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 50));

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "SYSTEM",
      entityIds: [documentId],
      payload: { documentId, contentLength: content.length, vectorEngine: "MOCK_PGVECTOR" },
      timestamp: new Date().toISOString(),
    });

    return true;
  },
};
