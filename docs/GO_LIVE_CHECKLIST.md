# Go-Live Release Gates Checklist

## Pre-Launch Gates (All Must Pass)

### 1. Bug Status

- [ ] No P0 (critical) bugs open
- [ ] No P1 (major) bugs open
- [ ] All P2 bugs triaged and scheduled

### 2. Payment Flow

- [ ] Paystack sandbox tested (card, bank transfer)
- [ ] Live test with 1 real merchant (₦100 test)
- [ ] Refund flow tested and approval-gated
- [ ] Webhook signature verification active
- [ ] Idempotency keys preventing duplicate charges

### 3. WhatsApp Integration

- [ ] Inbound messages stable
- [ ] Outbound messages with retries
- [ ] AI suggestions working
- [ ] Approval flow for sensitive actions
- [ ] Rate limits in place

### 4. Delivery

- [ ] Self-dispatch always works
- [ ] Kwik integration (if enabled) or feature-flagged
- [ ] Tracking updates visible to customers
- [ ] COD flow tested

### 5. Data & Compliance

- [ ] Data exports working
- [ ] Privacy policy displayed
- [ ] Terms of service displayed
- [ ] Refund policy displayed
- [ ] Consent collection working

### 6. Monitoring & Backups

- [ ] All SLO dashboards live
- [ ] Critical alerts configured and tested
- [ ] Daily backups running
- [ ] Restore drill completed
- [ ] DLQ monitoring active

### 7. Security

- [ ] Webhook signatures verified
- [ ] SSRF protection active
- [ ] Rate limits configured
- [ ] Secrets encrypted
- [ ] RBAC audit complete
- [ ] CSP headers set

### 8. Performance

- [ ] Mobile performance acceptable (3G)
- [ ] Bundle size optimized
- [ ] Images compressed
- [ ] DB indexes reviewed

## Sign-Off

| Role             | Name | Date | Approved |
| ---------------- | ---- | ---- | -------- |
| Engineering Lead |      |      | ☐        |
| Product Lead     |      |      | ☐        |
| Security         |      |      | ☐        |
| Operations       |      |      | ☐        |

## Go-Live Decision

**Status**: [ ] Ready / [ ] Not Ready

**Notes**:

---
