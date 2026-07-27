# LeadPilot AI CRM — SEO & Indexation Architecture

**Module:** SEO  
**Version:** v2.1.0  

---

## 1. Indexation Configuration

- **Dynamic Sitemap:** `src/app/sitemap.ts` (Generates `/sitemap.xml` listing public endpoints).
- **Robots.txt:** `src/app/robots.ts` (Allows search engine crawlers on marketing pages while excluding `/api/` and `/dashboard/`).
- **Open Graph Metadata:** Embedded Open Graph and Twitter Card tags across public routes.
