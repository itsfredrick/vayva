# Apps / Packages / Services Catalog (Ground Truth)

> This catalog is based on **folder structure + package.json + selected entrypoint reads**. Where runtime usage is unclear, status is marked **Unknown**.

## Apps (`apps/*`)

| Module | Purpose (evidence) | Stack | Entry points | Workspace deps (from package.json) | Likely depended-by | Prod usage status |
|---|---|---|---|---|---|---|
| `apps/merchant-admin` | Seller dashboard (README + metadata title) | Next.js 16.1.1, React 19.2.3, NextAuth | `src/app/*` App Router, `src/lib/auth.ts` | `@vayva/ui`, `@vayva/db`, `@vayva/shared`, `@vayva/api-client`, etc. | end users | Likely prod (has `vercel.json`, production scan CI targets it) |
| `apps/ops-console` | Internal ops console (README + metadata title) | Next.js 16.1.1, React 19.2.3, React Query | `src/app/*` and `src/app/api/ops/**` | `@vayva/ui`, `@vayva/db`, `@vayva/api-client` | internal ops | Likely prod (has `vercel.json`, ops guard CI) |
| `apps/storefront` | Customer storefront (README + metadata generation hits Prisma store) | Next.js 16.1.1, React 19.2.3 | `src/app/*` App Router | `@vayva/db`, `@vayva/ui`, `@vayva/content` | customers | Likely prod (has `vercel.json`) |
| `apps/marketing` | Marketing site (README + metadata) | Next.js 16.1.1, React 19.2.3 | `src/app/*` | `@vayva/ui`, `@vayva/shared`, `@vayva/content` | public | Likely prod (has `vercel.json`) |
| `apps/marketplace` | Marketplace experience (name/title only) | Next.js 16.1.1, React 19.2.3 | `src/app/*` | `@vayva/ui`, `@vayva/db`, `@vayva/shared` | customers | Unknown (no `vercel.json` shown in scan; lint disabled) |
| `apps/mobile` | Mobile app | Expo 52 + expo-router, RN 0.76.5 | `expo-router/entry` | `@vayva/api-client`, `@vayva/schemas`, `@vayva/theme` | mobile users | Unknown |
| `apps/worker` | Background job processor | Node + BullMQ | `src/worker.ts` | `@vayva/db`, `@vayva/redis`, `@vayva/shared` | internal | Unknown (likely prod if queues used) |

## Packages (`packages/*`)

| Module | Purpose (evidence) | Stack | Entry points | Depends on | Depended-by | Status |
|---|---|---|---|---|---|---|
| `packages/ui` | Shared UI/design system | TS + React + Radix + Tailwind | `src/index.ts` | `@vayva/theme`, `@vayva/content` | all apps | Active |
| `packages/theme` | Shared CSS/theme | TS + CSS export | `src/index.ts`, `src/css/index.css` | - | apps, ui | Active |
| `packages/schemas` | Shared Zod schemas | TS | `dist/index.js` (built) | `zod` | apps/services | Active |
| `packages/shared` | Shared utilities + constants + queue names | TS | `src/index.ts` | `@vayva/db`, BullMQ, ioredis, zod | apps/services/worker | Active |
| `packages/api-client` | Typed API client from OpenAPI | TS, openapi-typescript | `src/index.ts` + generated schema | `@vayva/shared` | apps/mobile | Active |
| `packages/redis` | Redis client wrapper | TS | `src/index.ts` | `ioredis` | worker/apps | Active |
| `packages/content` | Shared content utilities | TS | `src/index.ts` | - | apps/ui | Active |
| `packages/compliance` | Compliance utilities | TS | `src/index.ts` | `@vayva/db` | services/compliance-service, apps | Active |
| `packages/policies` | Policy rendering helpers | TS | `src/index.ts` | marked/dompurify | merchant-admin | Active |
| `packages/analytics` | Analytics schemas/types | TS | `src/index.ts` | zod | apps/services | Active |
| `packages/next-types` | Next-related shared types | TS | `dist/index.js` | - | marketplace | Unknown usage |
| `packages/reliability` | Reliability-related package | TS | unknown | unknown | unknown | Unknown (not scanned deeply) |
| `packages/extensions` | Extension utilities | TS | `src/index.ts` | - | apps | Unknown |
| `packages/education` | Education content/tools | TS | unknown | unknown | unknown | Unknown |
| `packages/load-test` | Load testing tooling | TS | unknown | unknown | unknown | Unknown |

## Infra (`infra/*`)

| Module | Purpose | Stack | Entry points | Depends on | Depended-by | Status |
|---|---|---|---|---|---|---|
| `infra/db` | Prisma schema + generated client wrapper exported as `@vayva/db` | Prisma + TS | `src/client.ts`, `prisma/schema.prisma` | `@prisma/client`, `pg` | all DB consumers | Active |
| `infra/scripts` | Infra scripts | Node | unknown | unknown | ops | Unknown |

## Services (`services/*`)

> Many services share the same template: Fastify + dotenv + `@vayva/db`.

| Service | Purpose (evidence) | Stack | Entry points | Depends on | Depended-by | Prod usage |
|---|---|---|---|---|---|---|
| `api-gateway` | HTTP gateway + reverse proxy to services | Fastify + http-proxy + cookies | `src/server.ts` | `@vayva/db`, `@vayva/shared`, jwt, swagger | frontends (likely) | Likely prod if used as single API host (needs confirmation) |
| `auth-service` | Auth endpoints for merchant/customer/ops/staff/onboarding/rbac | Fastify + JWT | `src/index.ts` | `@vayva/db`, `@vayva/schemas` | api-gateway | Likely prod (api-gateway proxies to it) |
| `payments-service` | Payments + webhook handling | Fastify + axios + BullMQ | `src/index.ts` (per scripts) | `@vayva/db`, `@vayva/shared` | api-gateway `/v1/payments` | Likely prod (needs confirmation) |
| `orders-service` | Orders | Fastify | `src/index.ts` | `@vayva/db`, `@vayva/schemas`, `@vayva/shared` | api-gateway `/v1/orders` | Likely prod (needs confirmation) |
| `whatsapp-service` | WhatsApp integration endpoints | Fastify + axios | `src/index.ts` | `@vayva/db` | api-gateway `/v1/whatsapp` | Likely prod (needs confirmation) |
| `ai-orchestrator` | AI routing/orchestration | Fastify + axios | `src/index.ts` | `@vayva/db` | api-gateway `/v1/ai` | Unknown |
| `approvals-service` | Approval workflows | Fastify | `src/index.ts` | `@vayva/db` | api-gateway `/v1/approvals` | Unknown |
| `notifications-service` | Notifications queueing/dispatch | Fastify | `src/index.ts` | `@vayva/db`, `@vayva/shared` | api-gateway `/v1/notifications` | Unknown |
| `webhook-service` | Generic webhook processing | Fastify + axios | `src/index.ts` | `@vayva/db` | unknown | Unknown |
| `catalog-service` | Catalog import / parsing | Fastify + csv-parser | `src/index.ts` | `@vayva/db` | api-gateway mentions `/api/products` rewrite to CORE | Unknown |
| `products-service` | Products domain | Fastify | `src/index.ts` | `@vayva/db` | unclear | Unknown |
| `fulfillment-service` | Fulfillment/logistics | Fastify + axios + BullMQ | `src/index.ts` | `@vayva/db`, `@vayva/shared` | unclear | Unknown |
| `risk-service` | Risk domain | Fastify | `src/index.ts` | `@vayva/db` | unclear | Unknown |
| `support-service` | Support/tickets | Fastify + csv-parser | `src/index.ts` | `@vayva/db` | api-gateway `/v1/tickets` | Unknown |
| `admin-service` | Admin domain service | Fastify | `src/index.ts` | `@vayva/db` | unclear | Unknown |
| `audit-service` | Audit logs | Fastify | `src/index.ts` | `@vayva/db` | api-gateway `/v1/audit` (CORE) | Unknown |
| `billing-service` | Billing | Fastify | `src/index.ts` | `@vayva/db` | unclear | Unknown |
| `marketing-service` | Marketing backend | Fastify | `src/index.ts` | `@vayva/db` | unclear | Unknown |
| `marketplace-service` | Marketplace backend | Fastify | `src/index.ts` | `@vayva/db` | unclear | Unknown |
| `onboarding-service` | Onboarding backend | Fastify | `src/index.ts` | `@vayva/db` | unclear | Unknown |
| `theme-service` | Theme backend | Fastify | `src/index.ts` | `@vayva/db` | unclear | Unknown |
| `template-service` | Template tooling (Octokit) | TS lib | `src/index.ts` | `@octokit/rest`, `@vayva/db` | merchant-admin | Active (as workspace dep) |

## Env vars required
A canonical env var list is in `docs/04-environment-variables.md`.
