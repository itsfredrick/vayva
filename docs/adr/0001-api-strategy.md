# ADR 0001 — API Strategy

## Context
The repo contains multiple ways to serve HTTP APIs:
- Next.js route handlers in apps (e.g. `apps/ops-console/src/app/api/**`).
- A Fastify `services/api-gateway` that proxies to many Fastify domain services.
- Many Fastify domain services under `services/*` (auth/payments/orders/whatsapp/etc.).

Evidence:
- `services/api-gateway/src/server.ts` proxies routes like `/v1/auth`, `/v1/orders`, `/v1/payments`, `/v1/whatsapp`.
- Next apps have their own server-side route handlers at least in ops-console.

This creates ambiguity over the **source of truth** for business logic and the operational runtime topology.

## Decision
Adopt a **gateway + services** pattern as the long-term API strategy:
- **Primary external API surface**: `services/api-gateway`.
- **Primary business logic**: domain services under `services/*`.
- **Next.js route handlers**:
  - allowed for *UI-adjacent* concerns only (BFF endpoints), e.g.
    - rendering helpers
    - small aggregations
    - internal ops-only endpoints if explicitly scoped
  - must not become the primary location for core business logic (orders/payments/auth).

## Alternatives considered
1. **Next.js-only API (route handlers as the main backend)**
   - Pros: fewer deployables, simple mental model.
   - Cons: repo already has a microservices suite and a gateway; would require consolidation and likely behavior changes.

2. **Services-only without gateway** (apps call each service directly)
   - Pros: less infra in the middle.
   - Cons: frontends must manage auth/cookies/CORS/observability per service; harder to evolve.

3. **Gateway monolith** (move all business logic into api-gateway)
   - Pros: fewer deployables than many services.
   - Cons: reverses the existing modularity; increases blast radius.

## Consequences
- Requires documenting and enforcing which endpoints are served where.
- Requires consistent auth/session propagation through the gateway.
- Requires versioning and OpenAPI ownership (api-gateway already has OpenAPI referenced by `@vayva/api-client`).

## Migration notes
- Inventory existing Next route handlers and classify:
  - keep as BFF
  - migrate to service
  - delete if dead
- For each domain (orders/payments/etc.), identify canonical service routes and adjust frontends to call gateway.
