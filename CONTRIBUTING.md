# LeadPilot AI CRM — Engineering Contribution Guidelines

Welcome to LeadPilot AI CRM! Follow these guidelines for contributing code and infrastructure updates.

---

## Monorepo Layout

- `apps/web`: Next.js 15 frontend application (`http://localhost:3000`)
- `apps/api`: Express.js backend server (`http://localhost:5000`)
- `packages/shared`: Shared domain interfaces and constants
- `packages/config`: ESLint, TypeScript, and Prettier configurations

---

## Development Workflow

1. Clone repository: `git clone https://github.com/hariom-wdsadhunik/SaaS-Project.git`
2. Install frontend dependencies: `cd apps/web && npm install`
3. Install backend dependencies: `cd apps/api && npm install`
4. Run frontend: `npm run dev` in `apps/web`
5. Run backend: `npm start` in `apps/api`
6. Run unit tests: `npm test` in `apps/api`
7. Run build verification: `npm run build` in `apps/web`
