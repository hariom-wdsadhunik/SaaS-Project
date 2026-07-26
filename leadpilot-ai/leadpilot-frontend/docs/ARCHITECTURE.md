# LeadPilot AI CRM — Enterprise System Architecture

---

## 1. High-Level System Architecture

```
+-----------------------------------------------------------------------------------+
|                                  Next.js 15 Client App                            |
|             (React 19, Tailwind CSS v4, Zustand Store, Lucide Icons)              |
+-------------------+-------------------+-------------------+-----------------------+
                    |                   |                   |
                    v                   v                   v
+-------------------+---+   +-----------+-------+   +-------+---------------+
| Storage & Document    |   |  Domain Event Bus |   |  Notification Engine  |
| Management Engine     |   | (DomainEvents/    |   | (NotificationService/ |
| (StorageService/      |   | EventDispatcher)  |   | Preferences/Center)   |
| SupabaseDocRepo)      |   |                   |   |                       |
+-------------------+---+   +-----------+-------+   +-------+---------------+
                    |                   |                   |
                    +-------------------+-------------------+
                                        |
                                        v
                    +-------------------+-------------------+
                    |        Supabase PostgreSQL Backend    |
                    | (26 Tables, RLS Enabled, B-Tree Ind.)|
                    +---------------------------------------+
```

---

## 2. Document & Storage Architecture Stack (Sprint v0.8.0)

- **Storage Subsystem (`src/platform/storage/`):** Decoupled `StorageService`, `DocumentUploader`, `DocumentDownloader`, `DocumentPreviewGenerator`, `ChecksumValidator`, and `FileValidator`.
- **Document Repository (`SupabaseDocumentRepository`):** Executes live document management queries against Supabase PostgreSQL and automatically appends events to `contact_timeline`.
- **AI Copilot Tool (`DocumentTool`):** Registered `document_intelligence_tool` providing OCR text extraction, document summaries, knowledge extraction, and RAG vector store lookups.
- **API Versioning (`/api/v1/`):** Versioned API endpoints (`/api/v1/documents`, `/api/v1/folders`, `/api/v1/uploads`, `/api/v1/shares`).
