# LeadPilot AI CRM — Appointments Module Architecture & Production Certification

This document outlines the architecture, lifecycle facade, repository contracts, and design patterns for the Appointments module of LeadPilot AI CRM.

## Module Architecture & Layering

```
src/
├── domain/appointment/
│   ├── types.ts                          # AppointmentStatus, AppointmentPriority, AppointmentEntity, AppointmentFilterState
│   ├── AppointmentLifecycleFacade.ts     # Primary facade coordinating booking, conflict detection, and reminders
│   ├── services/
│   │   └── AppointmentService.ts         # Dataset provider and audit logging
│   └── lifecycle/
│       ├── AppointmentWorkflowRules.ts   # State machine transitions (SCHEDULED -> CONFIRMED -> CHECKED_IN -> COMPLETED)
│       ├── AppointmentTransitionValidator.ts # Transition validator enforcing legal workflow moves
│       ├── AppointmentConflictService.ts # Overlapping schedule conflict detection
│       ├── AppointmentAvailabilityService.ts # Business working hours ($08:00-18:00$)
│       ├── AppointmentBookingService.ts  # Booking placement validator
│       ├── ReminderService.ts            # Offset calculation engine
│       ├── AppointmentAutomationService.ts # Telemetry auditor
│       └── AppointmentLifecycleEvents.ts # Domain audit events (AppointmentBooked, AppointmentStatusChanged)
├── contracts/appointment/
│   ├── repository.ts                     # AppointmentRepository contract interface
│   ├── query.dto.ts                      # AppointmentQueryDto
│   └── response.dto.ts                   # AppointmentResponseDto
└── components/appointments/
    ├── appointment-summary.tsx           # KPI metric cards
    ├── appointment-filters.tsx           # Search & filter bar
    ├── appointment-toolbar.tsx           # Grid / Table view mode switcher
    ├── appointment-card.tsx              # Grid card component
    ├── appointment-table.tsx             # Table view component
    ├── drawer/                           # Slide-over workspace (40% desktop, 100% mobile)
    └── forms/                            # AppointmentModalForm & RHF + Zod section components
```

## Performance & Optimization

- **React.memo:** Component cards are memoized to prevent re-rendering unaffected items during search/filter operations.
- **Static Pre-rendering:** Prerendered statically on Next.js 16 App Router Turbopack engine (`16/16` pages).
