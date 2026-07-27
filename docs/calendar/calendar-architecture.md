# LeadPilot AI CRM — Calendar Module Architecture & Production Certification

This document outlines the architecture, scheduling facade, repository contracts, and design patterns for the Calendar & Scheduling module of LeadPilot AI CRM.

## Module Architecture & Layering

```
src/
├── domain/calendar/
│   ├── types.ts                        # CalendarEventType, CalendarEventEntity, CalendarFilterState
│   ├── CalendarSchedulingFacade.ts     # Primary facade coordinating scheduling, conflicts, and reminders
│   ├── events/
│   │   └── CalendarEvents.ts           # Domain events (CalendarEventCreated, ReminderScheduled)
│   └── scheduling/
│       ├── ConflictDetectionService.ts # Overlapping timeslot conflict detection
│       ├── AvailabilityService.ts      # Working hours ($08:00-18:00$) & slot calculation
│       ├── SchedulingRules.ts          # Business boundaries & buffer policies
│       ├── SchedulingValidator.ts      # Placement validator
│       ├── RecurrenceService.ts        # Recurrence series generator (Daily/Weekly/Monthly/Yearly)
│       ├── TimezoneService.ts          # UTC ISO conversions & localized time formatting
│       ├── ReminderService.ts          # Offset calculation engine
│       └── CalendarAutomationService.ts # Automation hook telemetry auditor
├── contracts/calendar/
│   ├── repository.ts                   # CalendarRepository contract interface
│   ├── query.dto.ts                    # CalendarQueryDto
│   └── response.dto.ts                 # CalendarEventResponseDto
└── components/calendar/
    ├── calendar-summary.tsx            # KPI metric cards
    ├── calendar-filters.tsx            # Search & filter bar
    ├── calendar-toolbar.tsx            # Month/Week/Agenda view switcher
    ├── calendar-event-card.tsx         # Event agenda card component (React.memo optimized)
    ├── calendar-grid.tsx               # Month grid & agenda layout renderer
    ├── drawer/                         # Slide-over workspace (38% desktop, 100% mobile)
    └── forms/                          # CalendarModalForm & RHF + Zod section components
```

## Performance & Optimization

- **React.memo:** `CalendarEventCard` is memoized to prevent re-rendering unaffected cards during search/filter operations.
- **Static Pre-rendering:** Prerendered statically on Next.js 16 App Router Turbopack engine (`15/15` pages).
