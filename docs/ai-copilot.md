# LeadPilot AI CRM — AI Sales Copilot Architecture

**Module:** AI Sales Copilot  
**Version:** v3.1.0  

---

## 1. Capabilities & Engine Architecture

- **AI Lead Summary Engine ([`LeadSummaryEngine.ts`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/apps/web/src/platform/copilot/LeadSummaryEngine.ts)):** Extracts pre-qualified budget facts, timeline highlights, risk flags, and cross-sell opportunities.
- **AI Email Assistant ([`EmailCopilotService.ts`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/apps/web/src/platform/copilot/EmailCopilotService.ts)):** Generates follow-up email drafts, rewrites messages across tones (`professional`, `persuasive`, `concise`, `friendly`), and synthesizes email threads.
- **AI WhatsApp Assistant ([`WhatsAppCopilotService.ts`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/apps/web/src/platform/copilot/WhatsAppCopilotService.ts)):** Instant conversational reply drafting, follow-up scheduling, and chat history summaries.
- **Meeting Preparation Engine ([`MeetingPrepEngine.ts`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/apps/web/src/platform/copilot/MeetingPrepEngine.ts)):** Compiles pre-meeting executive overviews, open tasks, interaction count, and recommended talking points.
- **Daily Morning AI Brief ([`DailyBriefEngine.ts`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/apps/web/src/platform/copilot/DailyBriefEngine.ts)):** Ranks high-priority leads, flags deals at risk, lists tasks due today, and recommends next best actions.
- **Deal Health Engine ([`DealHealthEngine.ts`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/apps/web/src/platform/copilot/DealHealthEngine.ts)):** Calculates 0-100 closing probability, health grade (A-F), missing document flags, and risk indicators.
- **AI Command Center ([`/copilot`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/apps/web/src/app/(dashboard)/copilot/page.tsx)):** Consolidated dashboard with real-time brief cards, deal health predictions grid, instant copilot action tools, and interactive chat.

---

## 2. API v1 Copilot Endpoints

- `GET /api/v1/copilot/lead-summary`
- `POST /api/v1/copilot/email-assistant`
- `POST /api/v1/copilot/whatsapp-assistant`
- `GET /api/v1/copilot/meeting-prep`
- `GET /api/v1/copilot/daily-brief`
- `GET /api/v1/copilot/deal-health`
