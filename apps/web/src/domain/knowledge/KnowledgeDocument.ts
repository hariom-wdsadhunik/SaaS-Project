export type KnowledgeSourceType =
  | "DOCUMENT"
  | "NOTE"
  | "COMMUNICATION"
  | "EMAIL"
  | "TIMELINE"
  | "MEETING_SUMMARY"
  | "OCR_TEXT";

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  vector?: number[];
  metadata?: Record<string, unknown>;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  sourceType: KnowledgeSourceType;
  sourceEntityId?: string;
  organizationId: string;
  chunks: KnowledgeChunk[];
  indexedAt: string;
}
