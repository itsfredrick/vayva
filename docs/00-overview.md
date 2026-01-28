# Vayva Monorepo — Overview (Ground Truth)

## What Vayva is
Vayva is described in the repo `README.md` as a multi-tenant commerce + operations platform for the Nigerian market with WhatsApp commerce, payments (Paystack), logistics, and an internal ops console.

## Repo layout (monorepo)
- `apps/`: user-facing and internal applications (mostly Next.js), plus mobile/worker
- `packages/`: shared libraries (UI, schemas, shared utilities, db client, redis client, etc.)
- `services/`: Fastify-based microservices plus an `api-gateway`
- `infra/`: infrastructure packages (notably Prisma schema + generated client)

## High-level system diagram (ASCII)

```text
                 +-------------------+
                 |   Next.js Apps    |
                 |-------------------|
                 | merchant-admin    |
                 | ops-console       |
                 | storefront        |
                 | marketplace       |
                 | marketing         |
                 +---------+---------+
                           |
                           | (HTTP)
                           v
                 +-------------------+
                 |   api-gateway     |  (Fastify + http-proxy)
                 +---------+---------+
                           |
        +------------------+-------------------+------------------+
        |                  |                   |                  |
        v                  v                   v                  v
   auth-service       orders-service      payments-service    whatsapp-service
   (Fastify+JWT)      (Fastify)           (Fastify)          (Fastify)
        |
        v
  PostgreSQL (Prisma)  + Redis (BullMQ queues)

  worker (BullMQ consumer/producers) also talks to Postgres + Redis + external APIs.
```

## Key runtime components
Observed from code + manifests:
- **Frontends**
  - Next.js apps (Next 16.1.1 in package.json files)
  - Expo mobile app (`apps/mobile`)
- **Backend**
  - `services/api-gateway` (Fastify proxy + cookie-based session token)
  - Multiple Fastify services (auth, payments, orders, whatsapp, etc.)
- **Data**
  - Postgres via Prisma (`infra/db/prisma/schema.prisma`)
  - Redis via `@vayva/redis`
- **Background processing**
  - `apps/worker` using BullMQ

## Unknowns (explicit)
The repo contains both Next.js route handlers and Fastify services. This doc does not yet assert which execution path is production-authoritative for each domain (orders/payments/etc.). That needs evidence from:
- actual deployed infra (Vercel vs VPS)
- runtime env vars (`API_BASE_URL` / service URLs)
- where the apps point their API calls (api-gateway vs local Next routes)
