# LeadPilot AI CRM — Enterprise SaaS Platform (v1.0.0 GA)

LeadPilot AI CRM is a next-generation autonomous enterprise AI Customer Relationship Management (CRM) platform built for high-performance sales, real estate, and enterprise organizations.

---

## Key Enterprise Modules

1. **AI Copilot Workspace:** Multi-domain conversational AI interface integrating Leads, Contacts, Deals, Tasks, Appointments, Communications, Documents, and Analytics.
2. **Workflow Automation Engine:** Event-driven workflow runner with flexible triggers, conditions, and actions (Task Creation, User Assignment, Email, WhatsApp, Notifications).
3. **RAG Knowledge Base:** Decoupled chunking, embedding, and vector similarity search across documents, CRM notes, and communications.
4. **Omnichannel Communication:** Native WhatsApp Business API, SendGrid Email, and Twilio SMS adapter integrations with automatic timeline appending.
5. **Intelligent Document Platform:** Supabase Storage abstraction, document versioning, SHA-256 checksum verification, and AI OCR processing.
6. **Analytics & BI Engine:** 11 core KPIs, TTL caching, custom report builder with CSV/Excel/PDF exports, 30-day predictive forecasting, and executive dashboards.
7. **Multi-Tenant SaaS Security:** Enforced Row-Level Security (RLS), organizational tenant isolation (`organization_id`), and comprehensive observability suite.

---

## Getting Started

```bash
cd leadpilot-ai/leadpilot-frontend
npm install
npm run dev
```

### Build & Quality Verification

```bash
npm run lint
npm run build
```
