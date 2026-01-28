# Environment Variables (Canonical List — Safe Placeholders)

> Source of truth for the *template* is `.env.example` at repo root. This file consolidates and annotates usage.
> 
> **Important:** Do not put real secrets in this repo. Use placeholders only.

## Global
| Variable | Required | Used by | Notes |
|---|---:|---|---|
| `DATABASE_URL` | Yes | apps/services using Prisma | Postgres connection string |
| `REDIS_URL` | Optional | worker / services | Redis connection string |
| `NODE_ENV` | Yes | all | `production` / `development` |

## Auth
| Variable | Required | Used by | Notes |
|---|---:|---|---|
| `NEXTAUTH_SECRET` | Yes | NextAuth apps | Generate with `openssl rand -hex 32` |
| `NEXTAUTH_URL` | Yes | NextAuth apps | Base URL for callbacks |
| `BETTER_AUTH_SECRET` | Unknown | apps | Present in `.env.example`; usage not verified |
| `BETTER_AUTH_URL` | Unknown | apps | Present in `.env.example`; usage not verified |
| `JWT_SECRET` | Yes (for auth-service) | `services/auth-service` | Fastify JWT secret; must be strong/random |

## API Gateway
| Variable | Required | Used by | Notes |
|---|---:|---|---|
| `COOKIE_SECRET` | Yes | `services/api-gateway` | Cookie signing secret (32+ chars) |
| `SERVICE_URL_AUTH` | Yes | `services/api-gateway` | Upstream auth-service base URL |
| `SERVICE_URL_ORDERS` | Yes | `services/api-gateway` | Upstream orders-service base URL |
| `SERVICE_URL_PAYMENTS` | Yes | `services/api-gateway` | Upstream payments-service base URL |
| `SERVICE_URL_NOTIFICATIONS` | Yes | `services/api-gateway` | Upstream notifications-service base URL |
| `SERVICE_URL_WHATSAPP` | Yes | `services/api-gateway` | Upstream whatsapp-service base URL |
| `SERVICE_URL_CORE` | Yes | `services/api-gateway` | Upstream core service base URL |
| `SERVICE_URL_AI` | Yes | `services/api-gateway` | Upstream ai-orchestrator base URL |
| `SERVICE_URL_APPROVALS` | Yes | `services/api-gateway` | Upstream approvals-service base URL |
| `SERVICE_URL_SUPPORT` | Yes | `services/api-gateway` | Upstream support-service base URL |
| `SERVICE_URL_MERCHANT_ADMIN` | Yes | `services/api-gateway` | Merchant-admin origin (CORS allowlist) |
| `SERVICE_URL_OPS_CONSOLE` | Yes | `services/api-gateway` | Ops console origin (CORS allowlist) |
| `SERVICE_URL_STOREFRONT` | Yes | `services/api-gateway` | Storefront origin (CORS allowlist) |

## Payments (Paystack)
| Variable | Required | Used by | Notes |
|---|---:|---|---|
| `PAYSTACK_SECRET_KEY` | Yes (if payments enabled) | merchant-admin / payments-service | Secret key |
| `NEXT_PUBLIC_PAYSTACK_KEY` | Yes (if payments enabled) | client | Public key |
| `PAYSTACK_MOCK` | Optional | `services/payments-service` | If `true`, allow running without Paystack secret |
| `STOREFRONT_URL` | Optional | `services/payments-service` | Used for test-mode checkout URL |
| `SERVICE_URL_NOTIFICATIONS` | Optional | `services/payments-service` | Used to emit payment events / OTP notifications |

## Email (Resend)
| Variable | Required | Used by | Notes |
|---|---:|---|---|
| `RESEND_API_KEY` | Yes (if email enabled) | apps/services | API key |
| `RESEND_FROM_EMAIL` | Yes (if email enabled) | apps/services | Sender address |

## AI
| Variable | Required | Used by | Notes |
|---|---:|---|---|
| `GROQ_API_KEY` | Optional | apps/services | Groq API key |
| `OPENAI_API_KEY` | Optional | apps/services | OpenAI API key |

## Storage
| Variable | Required | Used by | Notes |
|---|---:|---|---|
| `BLOB_READ_WRITE_TOKEN` | Optional | apps | Vercel Blob token |
| `MINIO_*` | Optional | apps/services | S3/MinIO compatible storage |

## WhatsApp / Evolution
| Variable | Required | Used by | Notes |
|---|---:|---|---|
| `EVOLUTION_API_URL` | Optional | worker/services | Evolution API base URL |
| `EVOLUTION_API_KEY` | Optional | worker/services | Evolution API key |

## App URLs
| Variable | Required | Used by | Notes |
|---|---:|---|---|
| `NEXT_PUBLIC_APP_URL` | Yes | frontends | Merchant admin URL |
| `NEXT_PUBLIC_MARKETING_URL` | Yes | frontends | Marketing URL |
| `NEXT_PUBLIC_STOREFRONT_URL` | Yes | frontends | Storefront URL |
| `NEXT_PUBLIC_OPS_URL` | Yes | frontends | Ops console URL |

## Feature flags
| Variable | Required | Used by | Notes |
|---|---:|---|---|
| `FEATURE_FLAGS_ENABLED` | Optional | apps | boolean |
| `DEV_TOOLS_ENABLED` | Optional | apps | boolean |
| `OPS_P11_2_ENABLED` | Optional | apps | boolean |

## Unknowns / follow-ups
- There are additional env files inside app folders (e.g. `apps/merchant-admin/.env.example`). We have not reconciled them fully yet.
- Some services use `dotenv`, some use `@fastify/env`. Env validation is inconsistent across services.
