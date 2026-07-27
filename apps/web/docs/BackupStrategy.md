# Database & Storage Backup Strategy

- **Point-In-Time Recovery (PITR):** 30-day continuous WAL archiving.
- **Daily Snapshots:** Automated 00:00 UTC daily database snapshots with 90-day retention.
- **Storage Replication:** Cross-region Supabase Storage object mirroring.
