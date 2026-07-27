# Supabase Realtime Architecture & Subscription Manager

**Module:** Realtime Engine  
**Location:** `src/platform/realtime/`  

---

## Key Modules

- `RealtimeService.ts`: Main entry point for subscribing to live entity channels.
- `RealtimeChannelManager.ts`: Prevents duplicate channel subscriptions and manages automatic WebSocket reconnection.
- `RealtimeSubscription.ts`: Strongly typed channel configurations and callback interfaces.
- `RealtimeEventMapper.ts`: Maps raw CDC payloads to domain payloads.

## Entity Channels Supported

- `leads`
- `deals`
- `contacts`
- `tasks`
- `appointments`
- `dashboard`

## Memory & Connection Safeguards

- Deduplicates subscription IDs per entity.
- Cleans up unused channels when active subscriptions reach zero.
