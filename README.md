# UI Automation Framework

Playwright + TypeScript end-to-end test suite for [Open WebUI](http://localhost:3000), built on a Page Object Model (POM) architecture with risk-based tagging for targeted CI execution.

---

## Prerequisites

| Tool | Minimum Version | Install |
|------|----------------|---------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) or `brew install node` |
| npm | 9+ | Bundled with Node |
| Open WebUI | running | `docker run -d -p 3000:8080 ghcr.io/open-webui/open-webui:main` |

---

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd UIAutomation
```

### 2. Install dependencies

```bash
npm install
npx playwright install chromium
```

### 3. Configure environment

Copy the example below into a `.env` file at the project root and fill in your admin credentials:

```
BASE_URL=http://localhost:3000/
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

> `.env` is gitignored. Never commit credentials.

Authentication runs automatically before every test run — no manual login step required. The session is saved to `playwright/.auth/user.json` and reused for all tests.

---

## Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Full suite (headless) |
| `npm run test:headed` | Full suite with browser visible |
| `npm run test:critical` | Critical Path tests only |
| `npm run test:ai` | AI Feature tests only |
| `npx playwright test tests/new-chat.spec.ts` | Single spec file |

To watch the auth flow during a run:

```bash
HEADLESS=false npm run test:headed
```

---

## Project Structure

```
UIAutomation/
├── src/
│   ├── pages/          # Page Object Models — locators and interactions
│   ├── fixtures/       # Extended Playwright fixtures and global auth setup
│   ├── api/            # API helpers for test data seeding
│   └── utils/          # Shared utilities
├── tests/              # Spec files — max 20 lines of execution code each
├── .env                # Environment variables (gitignored)
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## Risk-Based Tags

Tests are tagged for targeted execution in CI pipelines.

| Tag | Purpose |
|-----|---------|
| `@critical-path` | Core user journeys — run on every push |
| `@ai-feature` | AI/LLM interface tests — structural assertions only |
| `@p1-auth` | Authentication flows |
| `@edge-case` | Boundary and negative path coverage |

Tags go on the `describe` block, not individual test titles.

```bash
npx playwright test --grep @critical-path
```

---

## Viewing Reports

```bash
npm run report
```

Screenshots on failure and traces on retry are saved to `test-results/`.

---

## CI

Tests run automatically on push and pull requests to `main` and `develop`.

The pipeline:
1. Spins up a fresh Open WebUI Docker container on port `3000`
2. Seeds the admin account via the signup API before any tests run
3. Runs the full Playwright suite against the live container

Required GitHub Actions secrets:

| Secret | Description |
|--------|-------------|
| `ADMIN_EMAIL` | Admin account email |
| `ADMIN_PASSWORD` | Admin account password |

- `retries: 2` on CI, `0` locally
- `workers: 2` on CI to match GitHub Actions runner CPU allocation
- Playwright browser binaries are cached by `package-lock.json` hash to skip re-downloads on unchanged versions
- Set `CI=true` in your pipeline to activate retry and worker settings automatically
