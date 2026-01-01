# Vercel Deployment Guide (Staging & Production)

## Topology
We deploy Vayva Platform as **3 separate Vercel Projects** from the same monorepo.

| Project Name | Framework Preset | Root Directory | Production Domain | Staging Domain |
|---|---|---|---|---|
| **vayva-storefront** | Next.js | `apps/storefront` | `*.vayva.ng` | `*.vayva-staging.vercel.app` |
| **vayva-admin** | Next.js | `apps/merchant-admin` | `app.vayva.ng` | `app-vayva-staging.vercel.app` |
| **vayva-ops** | Next.js | `apps/ops-console` | `ops.vayva.ng` | `ops-vayva-staging.vercel.app` |

---

## 1. Environment Variables (Matrix)

### Shared Variables (All Projects)
| Variable | Value (Prod) | Value (Staging) |
|---|---|---|
| `DATABASE_URL` | `postgres://...` (Supabase Prod) | `postgres://...` (Supabase Staging) |
| `DIRECT_URL` | `postgres://...` | `postgres://...` |
| `NEXT_PUBLIC_API_URL` | `https://api.vayva.ng` | `https://api-staging.vayva.ng` |
| `VAYVA_CANONICAL_ORIGIN` | `https://vayva.ng` | `https://vayva-staging.vercel.app` |

### Specific: Storefront
| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_STOREFRONT_URL` | `https://vayva.ng` | |

### Specific: Merchant Admin
| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_OPS_URL` | `https://ops.vayva.ng` | |
| `PAYSTACK_SECRET_KEY` | `sk_live_...` | `sk_test_...` |
| `PAYSTACK_PUBLIC_KEY` | `pk_live_...` | `pk_test_...` |
| `RESEND_API_KEY` | `re_...` | |

### Specific: Ops Console
| Variable | Value | Notes |
|---|---|---|
| `GROQ_API_KEY` | `gsk_...` | |
| `SENTRY_AUTH_TOKEN` | `...` | |

---

## 2. Configuration Steps

### A. Wildcard Domain (Storefront)
1. In Vercel > **vayva-storefront** > Settings > Domains.
2. Add `vayva.ng`.
3. Add `*.vayva.ng` (Wildcard).
4. Ensure your DNS provider (Cloudflare/Namecheap) has the Nameservers or CNAME pointing to Vercel.

### B. Subdomains (Admin & Ops)
1. In Vercel > **vayva-admin** > Settings > Domains.
   - Add `app.vayva.ng`.
2. In Vercel > **vayva-ops** > Settings > Domains.
   - Add `ops.vayva.ng`.

### C. Build Settings
- **Build Command**: `cd ../.. && pnpm build` (Root-relative if needed, but usually Vercel Turbo handles monorepos auto).
- **Framework**: Select "Next.js".
- **Install Command**: `pnpm install`.

---

## 3. Webhooks & Callbacks

### Paystack
- **Live Callback URL**: `https://app.vayva.ng/api/webhooks/paystack`
- **Test Callback URL**: `https://app-vayva-staging.vercel.app/api/webhooks/paystack`

### WhatsApp (Meta)
- **Callback URL**: `https://api.vayva.ng/api/webhooks/whatsapp` (Requires API Gateway deploy)
- **Verify Token**: Set in Env (`WHATSAPP_VERIFY_TOKEN`).
