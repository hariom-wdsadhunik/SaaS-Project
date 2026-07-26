# User Presence & Realtime Room Tracking

**Module:** Presence  
**Location:** `src/platform/presence/`  

---

## Supported Presence States

- `ONLINE`
- `OFFLINE`
- `AWAY`
- `BUSY`

## Realtime Features

- Tracks user presence per room or globally.
- Updates typing status via `isTyping` flags.
- Auto updates `lastSeen` timestamps on state transitions.
