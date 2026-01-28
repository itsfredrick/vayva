# Repository Structure (Ground Truth)

## Top-level directories

```text
apps/       # Applications (Next.js, Expo, worker)
packages/   # Shared libraries (UI, schemas, shared, api-client, redis, etc.)
services/   # Fastify microservices + api-gateway
infra/      # Infrastructure packages (notably Prisma schema/client)
scripts/    # repo scripts
tests/      # repo-level tests
```

## Conventions observed
- Monorepo via `pnpm-workspace.yaml`:
  - `apps/*`, `packages/*`, `infra/*`, `services/*`
- Turborepo tasks in `turbo.json`:
  - `build`, `lint`, `typecheck`, `dev`, `test`, `db:generate`, `db:push`

## What goes where (current state)
- **Apps**: Next.js applications with `src/app` App Router structure, and per-app `vercel.json` for some.
- **Services**: Fastify servers, typically `src/index.ts` or `src/server.ts`.
- **Packages**: workspace libraries consumed by apps and services.
- **Infra**: Prisma schema + generated client and wrapper (`infra/db`).

## Naming / entrypoint conventions
- Next apps:
  - entrypoint is Next App Router: `apps/<app>/src/app/**`
  - config: `apps/<app>/next.config.js`, `apps/<app>/tailwind.config.*`
- Services:
  - typically `services/<service>/src/index.ts` or `src/server.ts`
  - build output often `dist/` (`tsc`)
- Packages:
  - typically `packages/<pkg>/src/index.ts`

## Deviations / inconsistencies (documented)
- Some packages/services/apps have `lint` script set to `true` (lint effectively disabled in those modules).
- Next versions in manifests are `16.1.1`, but README claims Next 15.
- React versions differ: Next apps show React `19.2.3`, Expo app uses React `18.3.1`.
