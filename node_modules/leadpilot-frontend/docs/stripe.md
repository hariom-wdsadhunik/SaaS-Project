# LeadPilot AI CRM — Stripe Integration Guide

**Module:** Stripe Integration  
**Version:** v2.2.0  

---

## 1. Webhook Event Handlers

Supported webhook events in `WebhookHandler.ts`:
- `checkout.session.completed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
