# ADR 0004: Supabase PostgreSQL Persistence & Strict RLS

**Status:** Accepted  
**Date:** July 26, 2026  

## Context
LeadPilot AI CRM requires high-performance PostgreSQL persistence, real-time data sync, authentication integration, and security controls.

## Decision
We select Supabase PostgreSQL as the primary backend database platform:
- Schema migrations managed sequentially in `supabase/migrations/`.
- Consolidated setup script in `supabase/bootstrap.sql`.
- High-performance B-tree indexes added for foreign keys and timestamp ordering.
- Strict Row-Level Security (RLS) enabled on all 10 tables (**never using `USING (true)`**).

## Consequences
- Data is protected by PostgreSQL kernel-level security rules.
- Fast query execution under high concurrency.
