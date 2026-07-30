# LeadPilot AI CRM — Webhook Engine & HMAC Security

**Module:** Incoming & Outgoing Webhooks  
**Version:** v3.5.0  

---

## 1. Security Specification

All outgoing webhooks are signed using `X-LeadPilot-Signature` computed via HMAC SHA-256 using the endpoint's secret.
Incoming webhooks (e.g., Stripe, WhatsApp Cloud API) verify signatures against known secrets prior to payload execution.
