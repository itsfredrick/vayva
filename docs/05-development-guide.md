# Development Guide (Ground Truth)

## Prerequisites
- Node >= 20 (root `package.json` engines)
- pnpm 10.2.0 (root `package.json`)
- Postgres (CI uses Postgres 16)
- Redis (optional but needed for worker/queues)

## Install
```bash
pnpm install
```

## Common commands (repo root)
- `pnpm dev` → `turbo run dev`
- `pnpm build` → `turbo run build`
- `pnpm lint` → `eslint . --ext .ts,.tsx,.js,.jsx`
- `pnpm typecheck` → `turbo run typecheck`
- `pnpm test` → `turbo run test`
- `pnpm test:e2e` → Playwright

## App-specific dev ports (from app scripts)
- merchant-admin: `next dev -p 3000`
- storefront: `next dev -p 3001`
- ops-console: `next dev -p 3002`
- marketing: `next dev -p 3001 --webpack` (port conflict likely; needs clarification)
- marketplace: `next dev -p 3004`

## Database
- Prisma schema is `infra/db/prisma/schema.prisma`
- Prisma client generation:
  - root: `pnpm db:generate` (turbo)
  - package: `pnpm --filter @vayva/db db:generate`

## Tests
- Repo has Playwright config at root: `playwright.config.ts`.
- CI E2E steps are currently commented out in `.github/workflows/ci.yml`.

## Known issues / unknowns
- Lint is disabled (set to `true`) in several modules (apps and services). Root CI runs `pnpm lint`, but per-package lint scripts may not run meaningful checks.
- Marketing and storefront both use port 3001 in scripts; likely one is intended to run separately.
