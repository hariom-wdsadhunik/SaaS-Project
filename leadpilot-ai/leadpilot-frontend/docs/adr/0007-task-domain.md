# ADR 0007: Operational Task & Activity Management Architecture

**Status:** Accepted  
**Date:** July 26, 2026  

## Context
Tasks represent the daily operational agenda for real estate agents, requiring Kanban visualization, comments, cross-module entity linking, and activity logging.

## Decision
We implement `public.tasks`, `public.task_comments`, and `public.task_activity`:
- Tasks store foreign keys to `contact_id`, `lead_id`, and `deal_id`.
- UI provides Grid, Table, and Kanban views.
- Activity logging records task lifecycle transitions (`Task Created`, `Task Assigned`, `Task Completed`, `Task Archived`, `Comment Added`).

## Consequences
- Operations are accountable, tracked, and visible across executive dashboards and AI tools.
