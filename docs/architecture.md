# System Architecture

## 1. High-Level Components

* **apps/web**: Next.js App Router frontend. Serves Marketing, Storefront, Admin, and Marketplace.
* **apps/api**: Fastify backend. Handles core business logic, webhooks, and connects to DB/Redis.
* **apps/worker**: BullMQ worker process. Handles background jobs (payments, whatsapp, delivery).
* **packages/db**: Prisma ORM layer. Single source of truth for database schema.
* **packages/shared**: Shared types, Zod schemas, and constants.
* **packages/ui**: Shared Tailwind preset and React components.

## 2. Infrastructure

* **PostgreSQL**: Primary relational database.
* **Redis**: Queue management and cache.
