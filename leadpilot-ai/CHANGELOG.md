# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.8.0] - 2026-07-26

### Added
* **Document Database Migration (`supabase/migrations/20260726170000_create_document_tables.sql`)**: Created `folders`, `documents`, `document_versions`, `document_tags`, `document_permissions`, and `document_previews` tables with strict Row-Level Security (RLS) policies and B-tree indexes.
* **Storage Subsystem Architecture (`src/platform/storage/`)**: Built `StorageService`, `DocumentUploader`, `DocumentDownloader`, `DocumentPreviewGenerator`, `ChecksumValidator`, and `FileValidator`.
* **Document Repository (`SupabaseDocumentRepository`)**: Built live Supabase repository supporting upload, download, version creation, version restoration, search, move, rename, and share operations.
* **Contact Timeline Integration**: Connected document operations to automatically append `Upload`, `Rename`, `Share`, `Delete`, and `Restore` events to `contact_timeline`.
* **AI Document Tool (`DocumentTool`)**: Built `document_intelligence_tool` (`src/domain/ai/tools/DocumentTool.ts`) for OCR text extraction, document summaries, knowledge extraction, and RAG vector store lookups.
* **Versioned API v1 Endpoints (`src/app/api/v1/`)**: Introduced `/api/v1/documents`, `/api/v1/folders`, `/api/v1/uploads`, and `/api/v1/shares`.
* **Unit Test Suite**: Created `document-repository.test.ts`, `storage.test.ts`, `permissions.test.ts`, `upload.test.ts`, `search.test.ts`, and `versioning.test.ts`.

---

## [0.7.0] - 2026-07-26

### Added
* **Omnichannel Database Migration (`supabase/migrations/20260726160000_create_communication_tables.sql`)**: Created `conversations`, `conversation_participants`, `messages`, `attachments`, `message_templates`, and `delivery_receipts` tables with strict Row-Level Security (RLS) policies and B-tree indexes.
