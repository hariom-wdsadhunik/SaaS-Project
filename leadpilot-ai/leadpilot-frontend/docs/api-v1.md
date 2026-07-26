# LeadPilot AI CRM — API v1 Specification

**Module:** Versioned Public & Internal API  
**Base Route:** `/api/v1/`  

---

## Endpoint Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/communications` | `GET` | Retrieves a specific conversation record. |
| `/api/v1/communications` | `POST` | Creates a new conversation thread. |
| `/api/v1/messages` | `GET` | Searches message content across conversations. |
| `/api/v1/messages` | `POST` | Dispatches an outbound or inbound message. |
| `/api/v1/templates` | `GET` | Returns message templates by channel. |
| `/api/v1/notifications` | `GET` | Fetches user notifications and unread counts. |
| `/api/v1/notifications` | `POST` | Triggers a new notification dispatch. |
