# ADR 0004 — Environment Management

## Context
Env usage is inconsistent:
- Multiple `.env*` files exist at repo root and within apps/services.
- Some services use `dotenv`, some use `@fastify/env`, some appear to use direct `process.env`.
- There is a root `.env.example` template.

This creates risk of:
- missing required env vars at runtime
- inconsistent naming and duplication
- unsafe defaults

## Decision
Adopt a single env management pattern:
- Each **runtime component** (each Next app and each Fastify service) must have:
  - a small `src/env.ts` (or `src/lib/env.ts`) module
  - schema validation with Zod
  - a single exported, typed `env` object
  - **fail-fast** behavior for required secrets

Documentation:
- Root `docs/04-environment-variables.md` is the canonical list.
- Each component’s env module should be the source of truth for what it actually uses.

## Alternatives considered
1. Rely on `.env.example` only
   - Pros: simple.
   - Cons: runtime misconfigs still happen; no typed access.

2. `dotenv` everywhere
   - Pros: common.
   - Cons: still unvalidated unless combined with schema.

3. `@fastify/env` in services, custom in apps
   - Pros: pragmatic.
   - Cons: inconsistent patterns.

## Consequences
- Small per-service/app change needed to introduce env module.
- Requires updating CI/deploy docs to set required env vars.

## Migration notes
- Start with security-critical services first (auth, payments, gateway).
- Then standardize worker and remaining services.
- For Next apps, ensure client-exposed vars are prefixed `NEXT_PUBLIC_` and validated separately.
