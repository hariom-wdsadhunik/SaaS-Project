# Contributing to LeadPilot AI

Thank you for your interest in contributing to LeadPilot AI! We welcome contributions from developers of all skill levels. Please take a moment to review these guidelines before submitting code or opening pull requests.

---

## 🛠️ Development Environment Setup

### 1. Prerequisites
* Node.js v18.0.0+
* Git
* npm or yarn

### 2. Fork & Clone Repository
```bash
git clone https://github.com/your-username/SaaS-Project.git
cd leadpilot-ai
npm install
```

### 3. Running in Local Demo Mode
```bash
# Run server in zero-setup Demo Mode
npm start
```
The server will run on `http://localhost:3000`. You can log in using:
* **Email**: `admin@leadpilot.ai`
* **Password**: `admin123`

---

## 📐 Coding Standards & Architectural Guidelines

To maintain our high bar for code quality, all contributions must adhere to the following architectural rules:

1. **Repository Pattern Rule**:
   * **NEVER** import `db/supabase` or call `supabase.from(...)` directly inside controllers or services.
   * **ALWAYS** route data access through `db/index.js` (`repository`).
2. **Zero Database Branching Rule**:
   * Controllers must never contain logic like `if (isDemoMode) { ... } else { ... }`. Database selection is handled exclusively inside `db/index.js`.
3. **API Contract Preservation**:
   * Do NOT change existing route paths, HTTP status codes, or top-level JSON response keys without prior discussion.
4. **Linting & Formatting**:
   * Follow standard JavaScript CommonJS conventions.
   * Use 2-space indentation and explicit semicolon termination.

---

## 🌿 Branching Strategy & Git Workflow

We follow standard Git Feature Branching:

* `main`: Stable production branch.
* `feature/<feature-name>`: New feature implementations.
* `fix/<bug-name>`: Bug fixes and security patches.
* `refactor/<component-name>`: Architectural cleanups.

---

## ✍️ Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

* `feat(leads)`: Add bulk status update endpoint
* `fix(auth)`: Resolve JWT token expiration handling
* `refactor(core)`: Migrate sequence processing to repository layer
* `docs(readme)`: Update installation instructions
* `test(cron)`: Add worker lock simulation tests

---

## 🧪 Testing Expectations

Before opening a Pull Request, verify that all existing runtime verification scripts pass cleanly:

```bash
# Run syntax checks
node -c server.js

# Run runtime smoke tests
node scratch/test_runtime.js

# Run worker concurrency lock simulation
node scratch/test_concurrency.js

# Run idempotency test suite
node scratch/test_idempotency.js
```

---

## 📥 Submitting a Pull Request (PR)

1. Ensure your branch is up-to-date with `main` (`git rebase main`).
2. Provide a clear description of the problem solved and changes made.
3. List the test verification commands run and their results.
4. Tag repository maintainers for review.
