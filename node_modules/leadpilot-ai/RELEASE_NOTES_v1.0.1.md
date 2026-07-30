# Release Notes v1.0.1 — API Hardening & Observability

Release Milestone: `v1.0.1-api-hardening`  
Date: July 23, 2026

This release introduces critical API hardening, input validation, rate limiting, repository pagination query bounds, and enterprise structured logging across the LeadPilot AI backend.

---

## Highlights

### 🛡️ Security
* **Authentication-Specific Rate Limiting**: Added `middleware/rateLimiter.js` with `authLimiter` (5 attempts / 15 minutes) on `POST /api/auth/login` and `registerLimiter` (10 registrations / 1 hour) on `POST /api/auth/register` to block brute-force attacks and registration spam.
* **Zod Schema Validation**: Introduced `middleware/validate.js` and declarative Zod schemas (`schemas/authSchemas.js`, `schemas/leadSchemas.js`, `schemas/dealSchemas.js`, `schemas/propertySchemas.js`, `schemas/taskSchemas.js`, `schemas/sequenceSchemas.js`).
* **Centralized Validation Middleware**: Validates and sanitizes request payloads before reaching controller handlers, returning a uniform HTTP 400 Bad Request JSON error response with field-level details.
* **Production-Ready CORS Configuration**: Replaced development wildcard `origin: '*'` with dynamic origin verification in `config/index.js` and `server.js` (supporting comma-separated `CORS_ORIGIN` domains).

### 📈 Scalability & Query Bounds
* **Repository Pagination**: Updated `db/index.js` and `db/demoStore.js` with standardized `parsePaginationParams` pagination logic across all collection queries (`getLeads`, `getProperties`, `getTasks`, `getAppointments`, `getDeals`, `getNotes`).
* **Default Query Bounds**: Enforced default page size of 50 items (`page = 1`, `limit = 50`).
* **Maximum Query Limits**: Hard ceiling of 100 items per request (`limit` > 100 automatically capped to 100) to prevent memory spikes and database resource exhaustion.

### 📊 Observability & Logging
* **Centralized Pino Logger**: Integrated `logger/index.js` using Pino for high-performance structured logging.
* **Structured JSON Logs**: Production environment (`NODE_ENV=production`) emits single-line JSON log objects ready for CloudWatch, Datadog, or Logtail.
* **Development Pretty Printing**: Development environment (`NODE_ENV=development`) formats logs via `pino-pretty` with colorization and readable timestamps.
* **Global Error Logging**: Streamed HTTP request logs via Morgan into Pino and wrapped the global Express error handler with structured error logging.

### 🛠️ Engineering & Architecture
* **0 Breaking API Changes**: Preserved 100% backward compatibility for valid API clients and UI frontend routes.
* **Controller Simplification**: Controllers delegating pagination and payload sanitization directly to repository and validation layers, keeping controllers thin and clean.

---

## Verification & Testing

| Verification Category | Target Scope | Outcome |
| :--- | :--- | :-: |
| **Auth Rate Limiting Test** | Brute-force login simulation (Attempts 1 to 6) | **PASS (Attempt 6 returned HTTP 429)** |
| **Zod Schema Validation Test**| Valid payload vs. missing name / invalid email / invalid enum | **PASS (Returned HTTP 400 with details)** |
| **Repository Pagination Test**| Default, custom page/limit, max limit (500->100), invalid query fallback | **PASS (Bounded to limit=100)** |
| **CORS Verification Test** | Dev origin (`localhost:3000`) vs. non-browser server-to-server request | **PASS (HTTP 200 OK)** |
| **Pino Logger Output Test** | Development colorized pretty format vs. production JSON output | **PASS (Emitted structured JSON)** |
