# Chaos Engineering Playbook

## 📉 Philosophy

"Break it on purpose so it doesn't break by accident."

We perform chaos experiments to verify that our resilience mechanisms (Circuit Breakers, Rate Limiters, Fallbacks) work as expected.

---

## 🏗️ Experiment 1: Database Outage

**Hypothesis**: If the primary database fails, the application should return `503 Service Unavailable` with a JSON error, not hang or crash.

### Execution

1. **Target**: Staging Environment.
2. **Action**: Stop the `postgres` service or block via firewall.

```bash
# Example (if using Docker)
docker stop vayva-postgres
```

3. **Verification**:
    - Hit `GET /api/orders`.
    - Expect: `503` status.
    - Check Logs: Should see `PrismaClientInitializationError` handled gracefully.

---

## 🐢 Experiment 2: Paystack Latency

**Hypothesis**: If Paystack takes >5s to respond, the checkout flow should abort safely and not leave the Order in `PENDING_PAYMENT` forever.

### Execution

1. **Target**: Staging.
2. **Action**: Introduce network delay via `tc` (Traffic Control) or use a proxy like Toxiproxy.
3. **Verification**:
    - Initiate Checkout.
    - Expect: "Payment gateway timeout" user error after 10s.
    - Check Database: `Order.status` should remain `DRAFT` or move to `CANCELLED`.

---

## 🚦 Experiment 3: High Load (Rate Limiting)

**Hypothesis**: If a single IP floods the API, they should be blocked after X requests, preserving availability for others.

### Execution

1. **Tool**: `k6` or `scripts/chaos-test.ts`.
2. **Action**: Send 100 requests in 1 second to `/api/auth/session`.
3. **Verification**:
    - Requests 1-20: `200 OK`.
    - Requests 21+: `429 Too Many Requests`.

---

## 🧪 Safety Rules

1. **Never in Production** (unless explicitly authorized by CTO).
2. **Notify the Team** in `#engineering` before starting.
3. **Have a Rollback Plan** (e.g., restart script ready).
