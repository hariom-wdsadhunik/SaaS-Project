# ADR 0003: AI Copilot Tooling & Memory Orchestration Architecture

**Status:** Accepted  
**Date:** July 26, 2026  

## Context
The CRM requires AI copilot capabilities (Lead scoring, Deal analysis, Contact summary, Task urgency) operating with access control and execution safety.

## Decision
We implement a decoupled AI Tool Registry architecture:
- Each tool implements `AITool` (`src/domain/ai/tools/Tool.ts`).
- `ToolRegistry` registers tool instances (`TaskTool`, `ContactTool`, `DealTool`, `LeadTool`).
- `AIOrchestrator` handles user prompts, tool calling, and session memory context.

## Consequences
- AI tools run within permission boundaries.
- Clean separation between LLM prompt engineering and domain data repositories.
