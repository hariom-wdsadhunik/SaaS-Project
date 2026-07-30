# LeadPilot AI CRM — Intelligent Document Management Platform

**Module:** Intelligent Document Management Platform  
**Version:** v0.8.0  

---

## 1. Architectural Vision

The Intelligent Document Management Platform delivers enterprise document management capabilities with versioning, SHA-256 checksum integrity, metadata extraction, AI OCR pipeline integration, contact timeline auto-appending, and event bus pub/sub.

```
+-----------------------------------------------------------------------------------+
|                     Intelligent Document Platform Architecture                    |
+-------------------+-------------------+-------------------+-----------------------+
|  DocumentUploader | DocumentDownloader| PreviewGenerator  | ChecksumValidator     |
+-------------------+-------------------+-------------------+-----------------------+
                    |                   |                   |
                    v                   v                   v
+-----------------------------------------------------------------------------------+
|                      SupabaseDocumentRepository & RLS                             |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Entities

1. **Document (`documents`)**: Central file entity storing storage paths, SHA-256 checksums, version numbers, metadata, and OCR status.
2. **DocumentVersion (`document_versions`)**: Immutable version snapshots with change audit summaries.
3. **Folder (`folders`)**: Hierarchical folder structures with parent-child relations.
4. **DocumentPermission (`document_permissions`)**: Granular access levels (`READ`, `WRITE`, `ADMIN`).
5. **DocumentPreview (`document_previews`)**: Rendered image and PDF thumbnails.
