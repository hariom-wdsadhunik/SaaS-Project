# RAG Knowledge Base Architecture

**Module:** Knowledge Base  
**Location:** `src/domain/knowledge/`  

---

## 1. Provider Interfaces

`EmbeddingProvider` and `VectorStoreAdapter` interfaces decouple vector store implementations (`pgvector` / memory) from knowledge indexing logic.
