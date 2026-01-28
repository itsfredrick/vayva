# Refactor Roadmap (No-code plan)

> This roadmap is designed to be executed in small checkpoints with reversible diffs.

## Phase 1 — Safety & Guardrails

### Goals
- Prevent security incidents (secrets, auth defaults, webhook validation).
- Make CI meaningful and consistent.
- Establish “fail fast” env validation in critical runtime components.

### Likely impacted
- `services/auth-service`, `services/api-gateway`, `services/payments-service`
- Root env templates + docs
- CI workflows under `.github/workflows/*`

### Risks + mitigations
- Risk: breaking deployments due to stricter env requirements.
  - Mitigation: document required env vars, add clear startup errors, stage rollout.

### Acceptance criteria
- No insecure default secrets.
- Secrets are not stored in repo.
- CI has a secrets/leak prevention gate.

### Estimated checkpoints
- 1–3 checkpoints.

## Phase 2 — Consistency Standards

### Goals
- Re-enable lint everywhere and bring to a baseline.
- Align TS typecheck behavior across apps/services.
- Standardize API error response shape.

### Likely impacted
- `apps/storefront`, `apps/marketplace`, `services/*` with `lint: true`
- `.eslintrc.json`, per-app lint configs
- Shared error utilities (likely `packages/shared`)

### Risks + mitigations
- Risk: large volume of lint issues.
  - Mitigation: enable lint first, then fix in narrow scopes; introduce targeted overrides with TODOs tracked.

### Acceptance criteria
- `pnpm lint` produces actionable signal.
- `pnpm typecheck` is clean or has tracked exceptions.

### Estimated checkpoints
- 3–10 checkpoints.

## Phase 3 — Architecture Alignment

### Goals
- Clarify API boundaries (gateway vs Next route handlers).
- Move core business logic into services/packages (thin route handlers).
- Introduce repository pattern for Prisma access in services.

### Likely impacted
- `apps/*/src/app/api/**`
- `services/*/src/**`
- `packages/api-client`, `packages/schemas`, `packages/shared`

### Risks + mitigations
- Risk: behavior changes during extraction.
  - Mitigation: refactor by moving code without logic change; add tests around domain logic.

### Acceptance criteria
- Each domain has a canonical API surface.
- Minimal duplicate logic across apps.

### Estimated checkpoints
- 10–30 checkpoints (domain-by-domain).

## Phase 4 — UI Systemization + Performance

### Goals
- Standardize UI components and states.
- Reduce duplicated UI patterns.
- Improve performance (avoid unnecessary rerenders, paginate queries, image optimization).

### Likely impacted
- `apps/*/src/components/**`
- `packages/ui/**`

### Risks + mitigations
- Risk: visual regressions.
  - Mitigation: Playwright smoke tests, incremental UI refactors.

### Acceptance criteria
- Consistent component inventory.
- Consistent empty/loading/error states.

### Estimated checkpoints
- 5–20 checkpoints.
