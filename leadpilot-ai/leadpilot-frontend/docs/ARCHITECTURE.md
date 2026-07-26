# LeadPilot AI CRM — Enterprise System Architecture

---

## 1. Enterprise System Architecture (v2.1.0 Marketing & CRM Platform)

```
+-----------------------------------------------------------------------------------+
|                               Next.js 15 Unified Application                      |
|                                                                                   |
|  +-------------------------------------+   +-----------------------------------+  |
|  |     Marketing & Public Presence     |   |          CRM App Dashboard        |  |
|  | (Home, Features, Pricing, Sitemap)  |   | (Leads, Deals, AI Workspace, BI)  |  |
|  +------------------+------------------+   +-----------------+-----------------+  |
|                     |                                        |                    |
|                     +-------------------+--------------------+                    |
|                                         |                                         |
|                                         v                                         |
|                             Shared Design Tokens (v2.0.0)                         |
|                             (tokens.css, Button, Card, Badge)                    |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
                      +-------------------+-------------------+
                      |        Supabase PostgreSQL Backend    |
                      | (26 Tables, Strict Multi-Tenant RLS) |
                      +---------------------------------------+
```

---

## 2. Marketing Website Architecture

- **Public Routes:** Home (`/`), Features (`/features`), Pricing (`/pricing`).
- **SEO & Crawling:** Dynamic XML Sitemap (`/sitemap.xml`), Robots (`/robots.txt`), Open Graph & Twitter Cards metadata.
