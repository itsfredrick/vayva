# Vayva Platform: Credential Matrix (Authoritative)

**Usage Rule:** secrets must NEVER be committed. This document maps *Environment Variables* to their purpose.

## 1. Paystack (Payments)

| Config Item | Env Var Name | Service(s) | Staging Value | Production Value | Rotation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Secret Key** | `PAYSTACK_SECRET_KEY` | `payments-service` | `sk_test_...` | `sk_live_...` | Dashboard -> Settings -> API Keys |
| **Public Key** | `NEXT_PUBLIC_PAYSTACK_KEY` | `apps/storefront` | `pk_test_...` | `pk_live_...` | Dashboard -> Settings -> API Keys |
| **Webhook Secret** | `PAYSTACK_WEBHOOK_SECRET` | `api-gateway` | *(Set in Vercel)* | *(Set in Vercel)* | Dashboard -> Settings -> Webhooks |

*   **Vercel Projects:** `vayva-storefront`, `vayva-payments-service` (if separate) or `vayva-api-gateway`
*   **Verification:** `scripts/check-mocks.sh` ensures no hardcoded fallback.

## 2. WhatsApp (Meta / Cloud API)

| Config Item | Env Var Name | Service(s) | Staging Value | Production Value | Rotation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Access Token** | `WHATSAPP_API_TOKEN` | `whatsapp-service` | `EA...` (Test Number) | `EA...` (Live Number) | Meta Business Manager -> System Users |
| **Phone ID** | `WHATSAPP_PHONE_ID` | `whatsapp-service` | `100...` | `123...` | Meta Developer Portal |
| **App Secret** | `WHATSAPP_APP_SECRET` | `api-gateway` | *(App Dashboard)* | *(App Dashboard)* | Meta Developer Portal -> App Settings |
| **Verify Token** | `WHATSAPP_VERIFY_TOKEN` | `api-gateway` | `vayva_staging_verify` | *(Random String)* | Meta Developer Portal -> Webhooks |

*   **Vercel Projects:** `vayva-api-gateway`, `vayva-whatsapp-service`

## 3. Kwik (Logistics)

| Config Item | Env Var Name | Service(s) | Staging Value | Production Value | Rotation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **API Key** | `KWIK_API_KEY` | `fulfillment-service` | *(Test Env Key)* | *(Live Key)* | Kwik Dashboard |
| **Webhook Secret**| `KWIK_WEBHOOK_SECRET` | `api-gateway` | *(N/A if IP whitelisted)*| *(Set in Vercel)* | Kwik Dashboard settings |

*   **Vercel Projects:** `vayva-api-gateway`

## 4. Groq (AI / LLM)

| Config Item | Env Var Name | Service(s) | Staging Value | Production Value | Rotation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **API Key** | `GROQ_API_KEY` | `merchant-admin`, `ai-orchestrator` | `gsk_...` | `gsk_...` | Groq Console |
| **Rescue Key** | `GROQ_API_KEY_RESCUE` | `ops-console` | `gsk_...` | `gsk_...` | Groq Console (Separate Project) |

*   **Vercel Projects:** `vayva-admin`, `vayva-ops`, `vayva-ai-service`

## 5. Resend (Email)

| Config Item | Env Var Name | Service(s) | Staging Value | Production Value | Rotation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **API Key** | `RESEND_API_KEY` | `notifications-service` | `re_...` | `re_...` | Resend Dashboard |
| **From Domain** | `EMAIL_FROM_DOMAIN` | `notifications-service` | `staging.vayva.ng` | `vayva.ng` | DNS Verification Required |

*   **Vercel Projects:** `vayva-notifications-service` (or `vayva-api-gateway` if monolithic)
