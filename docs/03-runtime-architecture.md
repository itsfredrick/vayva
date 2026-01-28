# Runtime Architecture (Ground Truth)

## Request flow (observed)

### Frontends
- Next.js apps under `apps/*` render UI and also contain some Next route handlers (e.g. ops-console under `src/app/api`).

### API Gateway
- `services/api-gateway/src/server.ts` is a Fastify server that:
  - Sets CORS origins to the configured service URLs for Merchant Admin / Ops Console / Storefront.
  - Implements **cookie-based session token setting** for:
    - `POST /v1/auth/merchant/login` (sets `vayva_session` cookie)
    - `POST /v1/auth/ops/verify-mfa` (sets `vayva_session` cookie)
  - Proxies other routes to upstream services via `@fastify/http-proxy`.

## Auth/session models (multiple)

### Model A: NextAuth (merchant-admin)
- `apps/merchant-admin` uses `next-auth` with credentials provider + Prisma adapter.
- Session strategy is JWT.

### Model B: Gateway cookie token (`vayva_session`)
- `api-gateway` sets a cookie with a token returned by `auth-service`.

### Model C: Ops session guard (ops-console)
- `apps/ops-console` has an `OpsAuthService.requireSession()` guard used in route handlers.

**Unknown:** whether these three models are unified in production or represent parallel/transition states.

## Data flow
- Prisma schema: `infra/db/prisma/schema.prisma` (PostgreSQL).
- Prisma client is generated into `infra/db/src/generated/client` and re-exported via `infra/db/src/client.ts` as `@vayva/db`.

## Payments/webhooks
- `.env.example` documents Paystack.
- `api-gateway` contains routes for webhooks (e.g. `/webhooks/paystack`) and proxies to `payments-service`.
- Full webhook validation implementation was not fully scanned here (needs reading `services/api-gateway/src/server.ts` remainder + `services/payments-service/src/*`).

## Background jobs
- `apps/worker/src/worker.ts` uses BullMQ.
- Uses `@vayva/redis` connection.
- Implements queue workers for WhatsApp inbound/outbound, agent actions, delivery, and maintenance cleanup.

## Runtime topology (processes)
Likely processes in production (based on scripts/manifests; exact deployment is unknown):
- One or more Next.js deployments (Vercel) for:
  - marketing
  - merchant-admin
  - ops-console
  - storefront
  - (marketplace possibly)
- Fastify services deployments:
  - api-gateway
  - auth-service
  - payments-service
  - orders-service
  - whatsapp-service
  - others (risk/support/etc.)
- Worker process:
  - `apps/worker` (BullMQ)
- Postgres + Redis.

## Evidence gaps
To determine the authoritative runtime topology, we still need:
- Where frontends point their API calls (`NEXT_PUBLIC_API_URL` etc.)
- Whether api-gateway is deployed and used in production
- Whether Next route handlers are used in prod vs service calls
