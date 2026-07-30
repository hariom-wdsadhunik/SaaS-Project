# LeadPilot AI CRM — Production Readiness & Operational Checklist

This document provides a comprehensive operational readiness checklist for deploying LeadPilot AI CRM to production environments.

---

## 1. Environment & Configuration Checklist

- [ ] **NODE_ENV**: Set to `production`.
- [ ] **PORT**: Configure application port (default `3000` or assigned by host/PaaS).
- [ ] **JWT_SECRET**: Generate a strong 64-character random string (`openssl rand -hex 32`).
- [ ] **CRON_SECRET**: Generate a strong secret for authenticating scheduled background workers.
- [ ] **SUPABASE_URL**: Production Supabase project URL (e.g. `https://xxx.supabase.co`).
- [ ] **SUPABASE_SERVICE_KEY**: Production Supabase service role API key.
- [ ] **CORS_ORIGIN**: Restrict to authorized web UI domain(s) (e.g. `https://app.leadpilot.ai`).
- [ ] **EMAIL_API_KEY**: Valid SendGrid or SMTP credentials.
- [ ] **WHATSAPP_ACCESS_TOKEN**: Valid Meta Graph API access token.
- [ ] **WHATSAPP_BUSINESS_ACCOUNT_ID** & **PHONE_NUMBER_ID**: Valid Meta business identifiers.
- [ ] **WHATSAPP_WEBHOOK_VERIFY_TOKEN**: Secret token configured in Meta App Dashboard.

---

## 2. Security & Headers Checklist

- [ ] **HTTPS Enforcement**: Enforce SSL/TLS at reverse proxy or load balancer level.
- [ ] **HSTS**: `Strict-Transport-Security` header active with 1-year max-age in production mode.
- [ ] **Helmet Headers**: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- [ ] **CORS Security**: Disallow wildcard `*` origins in production environment.
- [ ] **Request Correlation**: Verify `X-Request-ID` headers are logged across microservices.
- [ ] **Rate Limiting**: Rate limiter active on `/api/` endpoints (200 requests per 15 min window).

---

## 3. Deployment Checklist

- [ ] **Startup Validation**: Application executes `validateConfig()` on boot and fails fast if secrets are missing.
- [ ] **Health Endpoints**:
  - `GET /health`: Returns application status, uptime, memory, version, and repository mode.
  - `GET /ready`: Verified by Kubernetes / load balancer readiness probes.
  - `GET /live`: Verified by process restart orchestrator / liveness probes.
- [ ] **Graceful Shutdown**: Process handles `SIGTERM` and `SIGINT` signals, closing active HTTP listeners cleanly within 10 seconds.

---

## 4. Backup & Disaster Recovery Strategy

- [ ] **Database Backups**: Configure point-in-time recovery (PITR) and daily automated database snapshots on Supabase Postgres.
- [ ] **Storage Backups**: Enable cross-region object replication or daily backups for uploaded documents bucket.
- [ ] **Recovery Time Objective (RTO)**: Target < 15 minutes.
- [ ] **Recovery Point Objective (RPO)**: Target < 5 minutes.

---

## 5. Monitoring & Observability Checklist

- [ ] **Structured Logging**: JSON format logging powered by `pino` with `X-Request-ID` correlation.
- [ ] **Log Rotation**: Configure `logrotate` or CloudWatch/Datadog log collection stream.
- [ ] **Alerting Rules**: Set alerts for:
  - Error rate spikes (> 1% of total HTTP requests).
  - P95 latency > 1000ms.
  - Unhandled process exceptions / crash restarts.
  - High memory usage (> 80% heap allocation).

---

## 6. Scaling Considerations

- [ ] **Stateless Node Processes**: Node.js app instance maintains zero sticky state; suitable for multi-instance horizontal autoscaling behind AWS ALB or Cloudflare.
- [ ] **Connection Pooling**: Use Supabase Connection Pooler (PgBouncer) for high-concurrency production database access.
- [ ] **Redis Caching**: Enable `REDIS_URL` for distributed multi-node cache and session management.
