# ADR 0002 — Auth Strategy

## Context
The repo currently exhibits multiple auth/session models:
- `apps/merchant-admin` uses **NextAuth** (`next-auth` + Prisma adapter) with JWT strategy.
- `services/api-gateway` sets a **cookie** named `vayva_session` based on an upstream token from `auth-service`.
- `apps/ops-console` uses an `OpsAuthService.requireSession()` guard in Next route handlers.

Evidence:
- `apps/merchant-admin/src/lib/auth.ts`
- `services/api-gateway/src/server.ts` sets `vayva_session` cookie
- `apps/ops-console` API routes use OpsAuthService guards (enforced by `.github/workflows/ops-guard.yml`).

This implies the system is either:
- mid-migration, or
- running separate auth models for different surfaces.

## Decision
Adopt **auth-service as the authoritative identity provider**, with **gateway-managed cookies** for web session transport.

Specifically:
- **Auth Service** (`services/auth-service`) is the canonical issuer/verifier of session tokens.
- **API Gateway** is responsible for:
  - issuing/refreshing HTTP-only cookies
  - verifying cookies for downstream calls (or forwarding to auth-service)
- **Frontends** should not implement independent credential validation or token issuance.

NextAuth usage:
- Short-term: allow NextAuth to remain **only** if it is configured to use the auth-service as the source of truth (e.g., via credentials provider that delegates to auth-service).
- Long-term: converge merchant-admin and ops-console auth flows onto the same session cookie contract.

## Alternatives considered
1. **NextAuth everywhere**
   - Pros: straightforward in Next apps.
   - Cons: does not cover mobile and services well; duplicates auth concerns.

2. **JWT in each service without centralized auth**
   - Pros: simple per-service.
   - Cons: key distribution/rotation complexity; inconsistent claims.

3. **Third-party auth provider**
   - Pros: outsource identity.
   - Cons: business constraints unknown; migration cost.

## Consequences
- Requires a single documented session token format and claim set.
- Requires consistent role/permission evaluation strategy.
- Requires aligning ops and merchant auth flows.

## Migration notes
- Define `vayva_session` cookie contract (name, lifespan, claim shape, rotation).
- Ensure NextAuth (if retained temporarily) delegates sign-in to auth-service.
- Update apps to call gateway endpoints for auth rather than local DB credential checks.
