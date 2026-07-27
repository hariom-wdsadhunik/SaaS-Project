# Supabase Storage Architecture & Security Controls

**Module:** Storage Subsystem  
**Location:** `src/platform/storage/`  

---

## 1. Storage Layers

- **`StorageService.ts`**: Encapsulates Supabase Storage bucket uploads, signed download URLs, and deletion.
- **`DocumentUploader.ts`**: Managed uploader performing MIME verification, 50MB ceiling checks, SHA-256 calculation, and storage writing.
- **`DocumentDownloader.ts`**: Generates signed URLs with temporal expiration (default 30 mins).
- **`FileValidator.ts`**: Enforces strict MIME whitelisting and security scan checks.
- **`ChecksumValidator.ts`**: Calculates and verifies SHA-256 checksums to detect data corruption.
