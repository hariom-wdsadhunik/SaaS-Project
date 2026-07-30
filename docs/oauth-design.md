# LeadPilot AI CRM — OAuth 2.0 Provider Architecture

**Module:** Google Workspace & Microsoft 365 OAuth  
**Version:** v3.5.0  

---

## 1. Flow Sequence

1. User initiates OAuth connection from `/integrations/google` or `/integrations/microsoft`.
2. Redirected to Provider Consent Screen with requested scopes.
3. Access Token & Refresh Token returned and stored with AES-256 encryption.
4. Automatic background delta-sync scheduled every 15-30 minutes.
