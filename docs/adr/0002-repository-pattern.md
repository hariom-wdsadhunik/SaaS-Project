# ADR 0002: Standardized Repository Pattern for Data Access

**Status:** Accepted  
**Date:** July 26, 2026  

## Context
Direct database calls (`supabase.from(...)`) scattered throughout React pages lead to duplicated query logic, fragile error handling, and tight coupling to Supabase.

## Decision
We implement a uniform Repository Pattern:
- Interface contracts live under `src/contracts/<domain>/repository.ts`.
- Concrete implementations live under `src/infrastructure/repositories/Supabase<Domain>Repository.ts`.
- Repositories handle row-to-entity mapping, error wrapping, audit logging, and timeline event appends.

## Consequences
- Single point of maintenance for database operations.
- Uniform async error handling across all CRM modules (`Lead`, `Deal`, `Contact`, `Task`).
