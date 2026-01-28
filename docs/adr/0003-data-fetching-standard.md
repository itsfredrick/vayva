# ADR 0003 — Frontend Data Fetching Standard

## Context
Different apps currently use different client-side fetching/caching libraries:
- `apps/ops-console` depends on `@tanstack/react-query`.
- `apps/merchant-admin` depends on `swr`.
- Other apps’ patterns were not exhaustively scanned here.

This increases cognitive load and makes it harder to standardize:
- caching
- retries
- request cancellation
- error UX patterns

## Decision
Standardize per app category:
- **Dashboard / internal apps** (merchant-admin, ops-console): **TanStack Query** as the default.
- **Marketing/storefront**: prefer server components + route-level fetching; avoid heavy client caching unless needed.

Rationale:
- Dashboards often require optimistic updates, invalidation, polling, and complex caching.
- TanStack Query is already in ops-console and is strong for this.

## Alternatives considered
1. Standardize on SWR
   - Pros: simpler API.
   - Cons: weaker mutation tooling / cache invalidation patterns for complex dashboards.

2. No client caching (server-only)
   - Pros: simplicity.
   - Cons: poor UX for dashboards; more server load.

## Consequences
- Merchant-admin will need gradual migration from SWR to React Query.
- Shared fetch wrappers should be introduced to enforce auth headers/cookies and consistent error mapping.

## Migration notes
- Introduce a `packages/api-client` + fetch wrapper that returns typed errors.
- For each feature module in merchant-admin, migrate SWR calls to query hooks incrementally.
