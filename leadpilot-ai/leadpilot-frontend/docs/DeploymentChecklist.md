# Production Deployment Checklist

1. [x] Environment Variables configured (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
2. [x] Database Migrations applied in order up to `20260726170000_create_document_tables.sql`.
3. [x] Storage Buckets created (`documents`, `avatars`, `previews`).
4. [x] ESLint passed with 0 errors (`npm run lint`).
5. [x] Next.js Production Build compiled without errors (`npm run build`).
6. [x] All Unit and Integration Tests passed.
