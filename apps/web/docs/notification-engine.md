# Notification Engine & Multi-Channel Routing

**Module:** Notification Engine  
**Location:** `src/platform/notifications/`  

---

## Supported Communication Channels

1. **IN_APP**: Interactive unread badge, dropdown list, and toast alerts.
2. **EMAIL**: Architecture abstraction driver.
3. **SMS**: Architecture abstraction driver.
4. **WHATSAPP**: Architecture abstraction driver.
5. **PUSH**: Architecture abstraction driver.

## Preference Filtering

Users can toggle channel preferences and mute options in `NotificationPreferencesManager`. Disallowed channels drop notifications before delivery.
