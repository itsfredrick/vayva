# Security Model & Compliance

## 1. Secret Management

- **No Secrets in Client**: API Keys (Paystack Public/Secret) are never exposed to the client-side code.
- **Environment Variables**: All secrets are loaded via `process.env` on the server-side only.
- **GitIgnore**: `.env` files are globally git-ignored.

## 2. Payout Security

- **Recipient Code Validation**: We do not store raw bank account numbers for withdrawal destinations. We resolve them once with Paystack, get a `recipient_code`, and store that.
- **Ledger Immutability**: Wallet transactions are stored in an append-only ledger structure. No "updates" to amounts are allowed, only "corrections" via new entries.
- **Double-Entry Logic**: Every credit to a wallet must have a corresponding debit logic (e.g. from a Customer Payment or System Bonus).

## 3. KYC Gates

- **Withdrawal Blocking**: The `/withdraw/eligibility` endpoint forcefully checks the `Merchant.kycStatus` before every single withdrawal request. UI checks are purely cosmetic; the backend remains the source of truth.
- **Limit Enforcement**: Unverified merchants are capped at NGN 0.00 withdrawals.

## 4. Webhook Verification

- **Signature Check**: All incoming webhooks from Paystack are verified using the `x-paystack-signature` header against our secret key to prevent spoofing.
- **Idempotency**: Webhook events are logged by ID. Duplicate events are ignored to prevent double-crediting wallets.
