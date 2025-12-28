# Security Overview

## 1. Architecture
Vayva is built on a modern, serverless architecture designed for security and scale.
- **Frontend**: Next.js App Router (React Server Components).
- **Backend**: Serverless API Routes (Node.js).
- **Database**: PostgreSQL with Prisma ORM (Strict Schema).

## 2. Authentication
- **Session Management**: Secure, HTTP-only cookies.
- **Password Hashing**: BCrypt with unique salts.
- **Role-Based Access**: strict `withRBAC` middleware ensures unauthorized users cannot access sensitive routes.

## 3. Network Security
- **TLS**: 100% of traffic is encrypted (HTTPS).
- **Headers**: HSTS, X-Frame-Options, and CSP are enforced.
- **Rate Limiting**: API endpoints are protected against abuse via Token Bucket middleware.

## 4. Tenant Isolation
Vayva is a multi-tenant platform. We use logical isolation ("Row-Level Security" pattern via application logic) to ensure Merchant A cannot access Merchant B's data. All database queries include mandatory `storeId` filters.

## 5. Webhook Security
Incoming webhooks (e.g., from Paystack) are cryptographically verified using HMAC signatures (`x-paystack-signature`) before processing.

## 6. Incident Response
In the event of a breach, we will notify affected merchants within 72 hours of confirmation.
