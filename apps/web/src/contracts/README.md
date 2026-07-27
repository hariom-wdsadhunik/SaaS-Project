# LeadPilot AI CRM — API Contracts & Repository Interfaces

This directory defines transport-agnostic, frontend-facing contracts and repository interfaces for all CRM business domains.

## Architecture & Principles

1. **Decoupled Architecture**: UI components depend strictly on repository interfaces, allowing seamless swapping of mock implementations for REST, GraphQL, or tRPC backends without UI changes.
2. **Centralized DTO Primitives**: Shared API response, error payload, and pagination contracts (`src/contracts/shared/api-response.dto.ts`).
3. **Repository Pattern**: Clean contracts for Lead, Deal, Property, Contact, and Task domains.

## Folder Structure

```
src/contracts/
├── shared/
│   └── api-response.dto.ts         # ApiResponse, ApiError, PagedResponse, PaginationMeta
├── lead/
│   └── repository.ts                # LeadRepository interface
├── deal/
│   └── repository.ts                # DealRepository interface
├── property/
│   └── repository.ts                # PropertyRepository interface
├── contact/
│   └── repository.ts                # ContactRepository interface
├── task/
│   └── repository.ts                # TaskRepository interface
└── index.ts                         # Unified barrel export
```
