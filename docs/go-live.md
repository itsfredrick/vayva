# Vayva Platform: Go-Live Checklist (30-Minute Launch)

**Target:** Production (`vayva.ng`)

## 1. Domain Finalization (DNS)

- [ ] **Ops Console:** Point `ops.vayva.ng` CNAME to `cname.vercel-dns.com`.
- [ ] **Merchant Admin:** Point `app.vayva.ng` CNAME to `cname.vercel-dns.com`.
- [ ] **Storefront:** Point `*.vayva.ng` (Wildcard) CNAME to `cname.vercel-dns.com`.
- [ ] **Apex:** A Record `@` to `76.76.21.21`.
- [ ] **Verification:** `dig ops.vayva.ng` returns Vercel IP.

## 2. Vercel Configuration (Env Vars)

- [ ] **Audit:** Compare Vercel `Production` Env Vars against [`docs/credentials-matrix.md`](./credentials-matrix.md).
- [ ] **Secrets:** Ensure `PAYSTACK_SECRET_KEY` starts with `sk_live_...`.
- [ ] **Gate:** Ensure `PAYSTACK_MOCK` is `false` (or unset).

## 3. Provider Switch-Over

- [ ] **Paystack:**
    - [ ] Switch Dashboard to **Live Mode**.
    - [ ] Update Webhook URL to: `https://api.vayva.ng/webhooks/paystack`.
- [ ] **WhatsApp:**
    - [ ] Graduate App from "Development" to "Live" mode.
    - [ ] Update Callback URL to: `https://api.vayva.ng/webhooks/whatsapp`.
- [ ] **Google/Auth:**
    - [ ] Add `https://app.vayva.ng` to Authorized Redirect URIs in GCP Console.

## 4. Deployment

- [ ] **Trigger:** Push `main` branch to remote.
- [ ] **Build:** Monitor Vercel build logs for `vayva-storefront`, `vayva-admin`, `vayva-ops`.
- [ ] **Gate:** Confirm no "Mock" warnings in build output (enforced by `check-mocks.sh`).

## 5. Day 1 Verification (War Room)

- [ ] **Ops Login:** Verify access to `https://ops.vayva.ng`.
- [ ] **Merchant Login:** Verify access to `https://app.vayva.ng`.
- [ ] **Live Transaction:**
    - [ ] Create a real product (₦100).
    - [ ] Purchase with real card.
    - [ ] refund immediately via Paystack Dashboard.
- [ ] **Sentry:** Monitor for spikes on default view.

## 6. Rollback Plan

**If Critical Failure (P0):**
1.  **Vercel:** "Instant Rollback" to previous deployment.
2.  **DNS (Extreme):** If DNS is broken, potential 1h TTL wait. Use Vercel default domains (`.vercel.app`) as backup access for Admins.
3.  **Comms:** Post status update to internal Slack.
