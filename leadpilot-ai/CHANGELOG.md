# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.7.0] - 2026-07-26

### Added
* **Omnichannel Database Migration (`supabase/migrations/20260726160000_create_communication_tables.sql`)**: Created `conversations`, `conversation_participants`, `messages`, `attachments`, `message_templates`, and `delivery_receipts` tables with strict Row-Level Security (RLS) policies and B-tree indexes.
* **Provider Abstraction Architecture (`src/platform/providers/communication/`)**: Implemented decoupled `CommunicationProvider` contract, `WhatsAppProvider` (Meta WhatsApp adapter), `EmailProvider` (SendGrid adapter), `SMSProvider` (Twilio adapter), and `ProviderFactory`.
* **Communication Repository (`SupabaseCommunicationRepository`)**: Built live Supabase repository handling conversation creation, message dispatch, receiving, search, and archiving.
* **Contact Timeline Auto-Append**: Connected message creation and receipt to automatically append timeline entries to `contact_timeline` for linked contacts.
* **AI Communication Tool (`CommunicationTool`)**: Built `communication_intelligence_tool` (`src/domain/ai/tools/CommunicationTool.ts`) for thread summaries, sentiment analysis, and suggested auto-replies.
* **Versioned API v1 Endpoints (`src/app/api/v1/`)**: Introduced `/api/v1/communications`, `/api/v1/messages`, `/api/v1/templates`, and `/api/v1/notifications`.
* **Unit Test Suite**: Created `communication-repository.test.ts`, `conversation.test.ts`, `provider-adapter.test.ts`, `notification-integration.test.ts`, and `api-v1.test.ts`.

---

## [0.6.5] - 2026-07-26

### Added
* **Supabase Realtime Infrastructure (`src/platform/realtime/`)**: Built `RealtimeService`, `RealtimeChannelManager`, `RealtimeSubscription`, and `RealtimeEventMapper` powering live streaming for `leads`, `deals`, `contacts`, `tasks`, `appointments`, and `dashboard`.
