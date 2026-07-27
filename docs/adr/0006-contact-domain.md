# ADR 0006: Customer Contact & Timeline Domain Design

**Status:** Accepted  
**Date:** July 26, 2026  

## Context
Contacts represent the long-term CRM relationship entity, requiring Lead-to-Contact conversion and unified activity history.

## Decision
We model Contacts as a dedicated domain module (`public.contacts` & `public.contact_timeline`):
- Conversion preserves `lead_id` provenance while upgrading status to `QUALIFIED`.
- `contact_timeline` logs interaction events from Leads, Deals, Tasks, and manual notes into a single chronological feed.

## Consequences
- Provides 360-degree customer visibility for real estate brokers.
