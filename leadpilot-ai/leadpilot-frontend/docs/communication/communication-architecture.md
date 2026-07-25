# LeadPilot AI CRM — Communication Module Architecture & Production Certification

This document outlines the architecture, omnichannel channels, workflow engine, repository contracts, and design patterns for the Communication & Messaging module of LeadPilot AI CRM.

## Module Architecture & Layering

```
src/
├── domain/communication/
│   ├── types.ts                          # CommunicationChannel, MessageStatus, ConversationEntity, MessageEntity
│   ├── CommunicationFacade.ts            # Primary facade coordinating messaging, channels, and recipient validation
│   ├── events.ts                         # Domain audit events (ConversationCreated, MessageSent)
│   ├── services/
│   │   ├── CommunicationService.ts       # Core messaging dataset provider & audit logging
│   │   ├── ConversationService.ts        # Unread state helpers
│   │   ├── TimelineService.ts            # Conversation activity timeline events
│   │   └── TemplateService.ts            # Message template provider
│   ├── channels/
│   │   ├── ChannelAdapter.ts             # ChannelAdapter contract interface
│   │   ├── WhatsAppAdapter.ts            # WhatsApp channel handler
│   │   ├── EmailAdapter.ts               # Email channel handler (RFC regex validation)
│   │   ├── SMSAdapter.ts                 # SMS channel handler
│   │   ├── InternalNoteAdapter.ts        # Internal broker note handler
│   │   ├── ChannelRegistry.ts            # Channel registry sorting handlers
│   │   └── ChannelOrchestrator.ts        # High-level channel dispatch orchestrator
│   └── automation/
│       ├── WorkflowRule.ts               # WorkflowRule specification
│       ├── AutomationEventBus.ts         # Pub/Sub event bus for cross-domain triggers
│       ├── WorkflowRegistry.ts           # Rules registry (priority sorted)
│       ├── WorkflowExecutor.ts           # Action execution auditor
│       └── WorkflowEngine.ts             # Event subscriber loop
├── contracts/communication/
│   ├── repository.ts                     # CommunicationRepository contract interface
│   ├── query.dto.ts                      # CommunicationQueryDto
│   └── response.dto.ts                   # ConversationResponseDto
└── components/communication/
    ├── communication-filters.tsx         # Search & channel filter bar
    ├── communication-toolbar.tsx         # Inbox header & action buttons
    ├── conversation-list.tsx             # Sidebar container for active threads
    ├── conversation-item.tsx             # List item card (React.memo optimized)
    ├── conversation-thread.tsx           # Main chat thread view container
    ├── message-bubble.tsx                # Message bubble component
    ├── message-composer.tsx              # Textarea, template picker & send trigger
    └── drawer/                           # Slide-over workspace (40% desktop, 100% mobile)
```

## Performance & Optimization

- **React.memo:** Conversation items and message bubbles are memoized to eliminate unnecessary re-renders when swapping active threads.
- **Static Pre-rendering:** Prerendered statically on Next.js 16 App Router Turbopack engine (`17/17` pages).
