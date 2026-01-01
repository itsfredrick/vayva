# Vayva Platform: Staging Rehearsal Script

**Status:** Required before Production.
**Env:** `*.vayva-staging.vercel.app` (Staging Environment)

## 1. Deploy Staging

1.  **Vercel Project Setup:**
    *   Ensure `vayva-storefront`, `vayva-admin`, `vayva-ops` projects exist.
    *   Connect to Monorepo (`apps/storefront`, etc.).
2.  **Environment Variables:**
    *   Set all variables from [`docs/credentials-matrix.md`](./credentials-matrix.md) (Staging Values).
    *   Set `NEXT_PUBLIC_APP_URL` to `https://app-vayva-staging.vercel.app`.
3.  **Deploy:**
    *   Push to `staging` branch (or configured preview branch).
    *   Wait for green build.

## 2. Webhook Wiring

1.  **Paystack (Test Mode):**
    *   Go to Paystack Dashboard -> Settings -> API Keys & Webhooks.
    *   Set Webhook URL: `https://vayva-api-staging.vercel.app/webhooks/paystack` (or API Gateway URL).
    *   Wait for "Url Valid" check.
2.  **WhatsApp (Test Number):**
    *   Go to Meta Developer Portal -> WhatsApp -> Configuration.
    *   Set Callback URL: `https://vayva-api-staging.vercel.app/webhooks/whatsapp`.
    *   Verify Token: `vayva_staging_verify`.
    *   Click "Verify and Save".

## 3. Automated Verification

1.  **Smoke Tests:**
    *   Run Playwright against Staging URLs:
        ```bash
        BASE_URL_STORE=https://demo.vayva-staging.vercel.app npx playwright test tests/e2e/smoke.spec.ts
        ```
    *   **Pass Criteria:** All smoke tests green. No 500s.

## 4. Manual "Golden Path" Rehearsal

1.  **Merchant Signup:**
    *   Go to `app-vayva-staging.vercel.app`.
    *   Sign up as `test-staging@vayva.ng`.
    *   Complete Onboarding (Business Name, Account).
2.  **Product Create:**
    *   Create Product "Staging Test Item" (Price: ₦100.00).
3.  **Checkout Flow:**
    *   Go to Storefront (`test-staging.vayva-staging.vercel.app`).
    *   Add "Staging Test Item" to cart -> Checkout.
    *   Pay using **Paystack Test Card**.
4.  **Verification:**
    *   **UI:** User sees "Order Successful" page.
    *   **Admin:** Order appears in Merchant Dashboard as `PAID`.
    *   **Database:** `LedgerEntry` created for merchant wallet.
    *   **Sentry:** No error events logged.

## 5. Ops Check

1.  **Ops Console:**
    *   Log in to `ops-vayva-staging.vercel.app`.
    *   Verify the new merchant appears in "Merchants" list.
    *   Check "System Health" on Dashboard (should assume Healthy).

**Sign-off:** If all steps pass, update the `Launch Ticket` to **READY FOR PROD**.
