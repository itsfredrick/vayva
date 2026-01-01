# Vayva Platform: Webhook Endpoint Map

**Routing Logic:** All webhooks hit `api-gateway` first, are verified, then proxied to internal services.

## 1. Paystack (Payments)

*   **Endpoint:** `/webhooks/paystack`
*   **Provider:** Paystack
*   **Verification:** `x-paystack-signature` (HMAC SHA512 using `PAYSTACK_WEBHOOK_SECRET`)
*   **Idempotency:** `event.data.reference` (Payment Reference)
*   **Behavior:**
    *   `charge.success` -> Updates `Wallet` (Credit) + `Ledger`.
    *   `transfer.success` -> Updates `Withdrawal` (Success).
    *   `transfer.failed` -> Updates `Withdrawal` (Failed) + Refunds Wallet.
*   **Expected Response:** `200 OK` (Immediate acknowledgment).

## 2. WhatsApp (Messaging)

*   **Endpoint:** `/webhooks/whatsapp`
*   **Provider:** Meta (Cloud API)
*   **Verification:** `x-hub-signature-256` (HMAC SHA256 using `WHATSAPP_APP_SECRET`)
*   **Idempotency:** `entry[0].changes[0].value.messages[0].id` (WAMID)
*   **Behavior:**
    *   `messages` (User sent text) -> Routes to `SalesAgent` or `Support`.
    *   `statuses` (delivered/read) -> Updates `MessageLog`.
*   **Expected Response:** `200 OK`.

## 3. Kwik (Delivery Updates)

*   **Endpoint:** `/webhooks/delivery` (or provider specific `/webhooks/kwik`)
*   **Provider:** Kwik Delivery
*   **Verification:** Custom Header or IP Whitelist (Check `KWIK_WEBHOOK_SECRET` usage).
*   **Idempotency:** `task_id` or `job_id`.
*   **Behavior:**
    *   `task.started` -> Order `IN_TRANSIT`.
    *   `task.succeeded` -> Order `DELIVERED`.
    *   `task.failed` -> Order `ISSUE` + Alert Ops.
*   **Expected Response:** `200 OK`.

## 4. Vayva Rescue (Internal Alerts)

*   **Endpoint:** `/webhooks/rescue`
*   **Provider:** Sentry (Integration) or CloudWatch
*   **Verification:** `Authorization: Bearer <RESCUE_WEBHOOK_SECRET>`
*   **Idempotency:** `sentry_event_id`.
*   **Behavior:**
    *   Triggers `RescueService.intakeIncident()`.
*   **Expected Response:** `202 Accepted` (Async processing).
