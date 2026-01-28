# Deployment Guide (Ground Truth)

## Vercel
Evidence:
- Root has `VERCEL_DEPLOYMENT.md` and `DEPLOYMENT_CHECKLIST.md`.
- Apps with `vercel.json`:
  - `apps/merchant-admin`
  - `apps/ops-console`
  - `apps/storefront`
  - `apps/marketing`

These `vercel.json` files generally:
- run install at repo root
- run turbo build filtered to that app

## CI/CD
- `.github/workflows/ci.yml` runs:
  - install
  - `pnpm lint`
  - prisma generate
  - `pnpm turbo run build`
  - `pnpm turbo run typecheck`
  - bundle size check
  - (E2E tests commented out)

- `.github/workflows/production-readiness.yml` runs production scan from `apps/merchant-admin`.
- `.github/workflows/ops-guard.yml` contains tripwires including Ops auth enforcement.

## Database migrations
Docs indicate:
- `pnpm db:push`
- `pnpm db:generate`

**Note:** The docs reference `packages/db` in places, but actual DB package is `infra/db` exported as `@vayva/db`. Migration commands should be validated against the current repo structure.

## Service deployments
Services have `dev/build/start` scripts but no single unified deployment manifest was found in this scan.
Unknowns:
- Whether services are deployed to VPS, containers, or serverless.
- Whether `api-gateway` is used in production as the primary API host.
