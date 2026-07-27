# LeadPilot AI CRM — Developer Contribution Guidelines

Thank you for contributing to LeadPilot AI CRM!

---

## 1. Development Environment Setup

```bash
cd leadpilot-frontend
npm install
npm run dev
```

---

## 2. Code Style & Architecture Rules

1. **Domain Isolation:** Never import Supabase, Next.js UI libraries, or HTTP clients inside `src/domain/`.
2. **Repository Contract Enforcers:** When adding a new CRM entity, define its interface in `src/contracts/` first, then implement the repository in `src/infrastructure/repositories/`.
3. **Database Changes:** Always create a new `.sql` file in `supabase/migrations/` AND update `supabase/bootstrap.sql`.
4. **UI Components:** Use Tailwind CSS, Lucide icons, and pre-built primitives in `src/components/ui/`.
5. **Linting & Build:** Run `npm run lint` and `npm run build` before opening a pull request.
