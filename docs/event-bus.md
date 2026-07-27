# Domain Event Bus Specification

**Module:** Event Bus  
**Location:** `src/platform/events/`  

---

## Registered Events

| Event Name | Aggregate | Trigger Description |
| :--- | :--- | :--- |
| `LeadCreated` | Lead | Emitted when a new lead registers or is ingested. |
| `LeadUpdated` | Lead | Emitted when status, score, or owner changes. |
| `ContactCreated` | Contact | Emitted when a contact is created or converted. |
| `TaskCompleted` | Task | Emitted when a broker completes a task. |
| `AppointmentScheduled` | Appointment | Emitted when a meeting or site viewing is booked. |
| `DealWon` | Deal | Emitted when a deal transitions to Closed Won. |

## Handler Isolation

The `EventDispatcher` executes subscribers in `Promise.all` wrapped try/catch blocks. An unhandled exception in one subscriber will never halt or throw during event publication.
