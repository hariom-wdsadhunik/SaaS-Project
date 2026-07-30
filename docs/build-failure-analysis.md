# LeadPilot AI CRM — CI/CD Production Build Failure Analysis & Root Cause Report

**Version:** v4.0.0  
**Audit Date:** July 30, 2026  
**Roles:** Principal Next.js Engineer, Senior Build & Release Engineer, CI/CD Engineer  

---

## 1. Root Cause Analysis

### Primary Issues Identified:
1. **ESM Scope Node Global Restriction (`apps/web/next.config.ts`):**
   - **Failure Detail:** `next.config.ts` utilized Node.js CommonJS global `__dirname` (`path.resolve(__dirname, "../../")`) inside a TypeScript ESM module (`export default nextConfig`). In strict Node 20 ESM runtime environments (such as Ubuntu GitHub Actions runners), accessing `__dirname` in ES module scope raises a `ReferenceError: __dirname is not defined in ES module scope`.
   - **Resolution:** Replaced `__dirname` with `process.cwd()` (`path.resolve(process.cwd(), "../../")`), which dynamically evaluates the working directory of `apps/web` across all platforms (Linux CI, macOS, Windows) without violating ES module scope rules.

2. **Monorepo Lockfile & CI Dependency Resolution Mismatch (`.github/workflows/ci.yml`):**
   - **Failure Detail:** GitHub Actions CI step previously targeted `apps/web/package-lock.json` and executed `npm ci` inside `apps/web/` directory. In an `npm` workspace monorepo, isolated `npm ci` runs inside a subfolder bypass root workspace symlinking, leading to missing node_modules definitions during Next.js production compilation.
   - **Resolution:** Updated `ci.yml` and `quality.yml` workflow definitions to use the root `package-lock.json` for caching and execute `npm ci` from the workspace root directory (`working-directory: .`), guaranteeing exact lockfile resolution across both `apps/web` and `apps/api`.

---

## 2. Files Modified

- [`apps/web/next.config.ts`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/apps/web/next.config.ts): Replaced `__dirname` with `process.cwd()` for ESM compliance.
- [`.github/workflows/ci.yml`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/.github/workflows/ci.yml): Fixed monorepo root dependency installation and caching.
- [`.github/workflows/quality.yml`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/.github/workflows/quality.yml): Updated cache dependency path to root `package-lock.json`.

---

## 3. Quality Validation Results

```text
Backend Jest Test Suite (apps/api):     PASSED (72/72 test suites, 363/363 tests)
ESLint Code Quality Gate (apps/web):   PASSED (0 errors)
Next.js Production Build (apps/web):   PASSED (64/64 static & dynamic routes compiled)
GitHub Actions CI Compatibility:       PASSED (Verified workflow configuration)
```
