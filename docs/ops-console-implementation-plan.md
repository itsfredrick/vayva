# Vayva Ops Console - Full Implementation Plan

## Contract B: Complete Feature Specification

### URL Structure
- **Ops Console**: `vayva.ng/ops/*`
- **Merchant Dashboard**: `vayva.ng/dashboard/*`
- **Storefront**: `*.vayva.ng`

---

## Global Rules (Non-Negotiable)

1. ✅ **Login must not render shell**: `/ops/login` uses auth-only layout
2. ✅ **All protected pages require session**: Guard in `(app)/layout.tsx`
3. ⏳ **Every write action requires**:
   - Role check (`OPERATOR`, `SUPERVISOR`, `OWNER`)
   - `{ reason }` input
   - Confirmation step (type merchant name/id for destructive)
   - Audit log entry
4. ✅ **No mock data**: Show "Not configured" with real checks
5. ⏳ **Redaction everywhere**: Payload viewers must redact secrets/PII
6. ⏳ **Consistent UI states**: Loading, empty, error, success on every page

---

## Implementation Batches

### ✅ Batch O1: Auth Layout Split + Login + Protected Shell Guard
**Status**: COMPLETE

**Completed**:
- [x] Route groups: `(auth)` and `(app)`
- [x] Auth layout (NO shell)
- [x] App layout (WITH shell, server-side guard)
- [x] Clean login page with password reveal
- [x] Middleware protection for `/ops/*` and `/api/ops/*`
- [x] Safe redirect with `next` parameter
- [x] Bootstrap user creation on first login

**Files Created**:
- `apps/ops-console/src/app/ops/(auth)/layout.tsx`
- `apps/ops-console/src/app/ops/(auth)/login/page.tsx`
- `apps/ops-console/src/app/ops/(app)/layout.tsx`
- `apps/ops-console/src/middleware.ts`
- `apps/ops-console/.env.local`

---

### ⏳ Batch O2: Dashboard + Health + Summary APIs
**Status**: IN PROGRESS

**Pages to Create**:
1. `/ops` - Dashboard (overview)
2. `/ops/health` - System Health

**Components Needed**:
- Health Summary Strip (4 services)
- Key Counters (range-aware)
- Exceptions Queue (actionable list)
- Top Merchants (GMV 30d)
- Rescue Spotlight

**APIs to Create**:
- `GET /api/ops/metrics/summary?range=24h|7d|30d`
- `GET /api/ops/exceptions?range=...`
- `GET /api/ops/health`
- `POST /api/ops/diagnostics/export`

**Current Status**:
- Some pages exist but use mock data
- Need to wire real APIs
- Need to add range picker to topbar

---

### ⏳ Batch O3: Merchants List + Detail
**Status**: PARTIALLY COMPLETE

**Existing**:
- ✅ `/ops/merchants` - List page exists
- ✅ `/ops/merchants/:id` - Detail page exists
- ✅ Basic API routes exist

**Needs**:
- [ ] Add filters (plan, kyc, risk, search)
- [ ] Add tabs to detail page (Overview, Orders, Payments, Deliveries, KYC, Support, Audit, Actions)
- [ ] Implement guarded actions with `{ reason }` input
- [ ] Add confirmation modals for destructive actions

**APIs to Enhance**:
- `GET /api/ops/merchants?q=&plan=&kyc=&risk=&page=`
- `POST /api/ops/merchants/:id/actions/disable-payouts`
- `POST /api/ops/merchants/:id/actions/enable-payouts`
- `POST /api/ops/merchants/:id/actions/force-kyc-review`
- `POST /api/ops/merchants/:id/actions/replay-webhook`

---

### ⏳ Batch O4: Webhooks (View + Replay)
**Status**: PARTIALLY COMPLETE

**Existing**:
- ✅ Basic webhook routes exist

**Needs**:
- [ ] Create `/ops/webhooks` list page
- [ ] Add detail drawer with redacted payload
- [ ] Add processing logs view
- [ ] Implement replay action (guarded)
- [ ] Add mark-resolved action

**APIs to Create/Enhance**:
- `GET /api/ops/webhooks?provider=&status=&q=&page=`
- `GET /api/ops/webhooks/:id`
- `POST /api/ops/webhooks/:id/replay` (with reason)
- `POST /api/ops/webhooks/:id/mark-resolved` (with reason)

---

### ⏳ Batch O5: Orders + Deliveries
**Status**: NOT STARTED

**Pages to Create**:
- `/ops/orders` - Orders list
- `/ops/orders/:id` - Order detail with timeline
- `/ops/deliveries` - Deliveries list
- `/ops/deliveries/:id` - Delivery detail

**APIs to Create**:
- `GET /api/ops/orders?q=&status=&merchantId=&page=`
- `GET /api/ops/orders/:id`
- `GET /api/ops/orders/:id/timeline`
- `POST /api/ops/orders/:id/actions/mark-investigating`
- `GET /api/ops/deliveries?status=&merchantId=&page=`
- `GET /api/ops/deliveries/:id`
- `POST /api/ops/deliveries/:id/retry`

---

### ⏳ Batch O6: Payouts + Reports
**Status**: PARTIALLY COMPLETE

**Existing**:
- ✅ `/ops/payouts` page exists (uses mock data)

**Needs**:
- [ ] Wire real payout data
- [ ] Add KPI tiles (pending, failed, total 7d)
- [ ] Implement retry action (guarded)
- [ ] Add CSV export (audited)

**APIs to Create**:
- `GET /api/ops/payouts?status=&merchantId=&page=`
- `GET /api/ops/payouts/:id`
- `POST /api/ops/payouts/:id/retry`
- `GET /api/ops/reports/payouts.csv?range=`

---

### ⏳ Batch O7: Inbox + Tickets
**Status**: PARTIALLY COMPLETE

**Existing**:
- ✅ `/ops/support` page exists (basic)

**Needs**:
- [ ] Create `/ops/inbox` - Split view conversations
- [ ] Create `/ops/tickets` - Ticket management
- [ ] Add metadata panel (merchant, last order, risk)
- [ ] Implement reply action (audited)
- [ ] Implement escalate to ticket action
- [ ] Add SLA badges

**APIs to Create**:
- `GET /api/ops/inbox/conversations?q=&status=&page=`
- `GET /api/ops/inbox/conversations/:id`
- `POST /api/ops/inbox/conversations/:id/reply`
- `POST /api/ops/inbox/conversations/:id/escalate`
- `GET /api/ops/tickets?status=&page=`
- `GET /api/ops/tickets/:id`
- `POST /api/ops/tickets/:id/update`

---

### ⏳ Batch O8: KYC + Disputes + Privacy
**Status**: PARTIALLY COMPLETE

**Existing**:
- ✅ `/ops/kyc` page exists (uses mock data)

**Needs**:
- [ ] Create `/ops/disputes` page
- [ ] Create `/ops/privacy` (DSR) page
- [ ] Wire real KYC data
- [ ] Implement approve/reject actions (guarded)
- [ ] Add document metadata view (no raw docs)
- [ ] Implement privacy export/delete requests

**APIs to Create**:
- `GET /api/ops/kyc?status=&page=`
- `GET /api/ops/kyc/:id`
- `POST /api/ops/kyc/:id/approve`
- `POST /api/ops/kyc/:id/reject`
- `GET /api/ops/disputes?status=&page=`
- `GET /api/ops/disputes/:id`
- `POST /api/ops/disputes/:id/resolve`
- `GET /api/ops/privacy/search?q=`
- `POST /api/ops/privacy/export`
- `POST /api/ops/privacy/delete`
- `GET /api/ops/privacy/requests?page=`

---

### ⏳ Batch O9: Rescue + Audit + Runbook
**Status**: PARTIALLY COMPLETE

**Existing**:
- ✅ `/ops/runbook` page exists
- ✅ `/ops/audit` page exists (uses mock data)

**Needs**:
- [ ] Create `/ops/rescue` - Diagnose mode
- [ ] Wire real audit log data
- [ ] Add guided checks to rescue
- [ ] Add run history
- [ ] Render runbook from markdown

**APIs to Create**:
- `POST /api/ops/rescue/diagnose`
- `POST /api/ops/rescue/checks/run`
- `GET /api/ops/rescue/runs?range=`
- `GET /api/ops/rescue/runs/:id`
- `GET /api/ops/audit?actor=&action=&merchantId=&range=&page=`
- `GET /api/ops/audit/:id`
- `GET /api/ops/runbook` (optional)

---

## Shared Backend Enforcement (All Batches)

### Required for Every `/api/ops/*` Route:

```typescript
// 1. Require session
const { user } = await OpsAuthService.requireSession();

// 2. For write operations, require role
if (isWriteOperation) {
  OpsAuthService.requireRole(user, 'OPERATOR' | 'SUPERVISOR' | 'OWNER');
}

// 3. For write operations, require reason
const { reason } = await req.json();
if (!reason) {
  return NextResponse.json({ error: 'Reason required' }, { status: 400 });
}

// 4. Create audit log entry
await OpsAuditEvent.create({
  actorId: user.id,
  action: 'ACTION_NAME',
  targetType: 'Merchant' | 'Order' | 'Webhook' | etc,
  targetId: id,
  reason,
  metadata: { ...redactedData },
});

// 5. Redact sensitive data in responses
return NextResponse.json(redact(data));
```

---

## Ops Shell Structure

### Sidebar Navigation

**Overview**
- Dashboard (`/ops`)
- System Health (`/ops/health`)

**Operations**
- Orders & Payments (`/ops/orders`)
- Deliveries (`/ops/deliveries`)
- Webhooks (`/ops/webhooks`)
- Payouts (`/ops/payouts`)

**Risk & Compliance**
- KYC (`/ops/kyc`)
- Disputes (`/ops/disputes`)

**Merchants**
- Merchants (`/ops/merchants`)
- Stores & Domains (`/ops/stores`)

**Support**
- Inbox (`/ops/inbox`)
- Tickets (`/ops/tickets`)

**Governance**
- Audit Log (`/ops/audit`)
- Data Requests (DSR) (`/ops/privacy`)

**Rescue**
- Rescue Console (`/ops/rescue`)
- Runbook (`/ops/runbook`)

### Topbar Components
- Global search (merchant/order/payout/webhook)
- Time range picker (24h/7d/30d/custom)
- Environment badge (Development/Staging/Production)
- Alerts bell (notifications)
- User menu (profile, logout)

---

## Testing Requirements (Per Batch)

After each batch:
```bash
pnpm -w typecheck
pnpm -w lint
pnpm -w test
pnpm -w build
```

### Smoke Tests
1. Unauth access redirects to login
2. Login succeeds and redirects to dashboard
3. All pages load without errors
4. All APIs require auth
5. Write actions require reason
6. Audit logs are created

---

## Current Progress Summary

### ✅ Complete
- Auth boundary fix (Batch O1)
- Login flow with clean UX
- Middleware protection
- Session management
- Bootstrap user creation

### 🔄 In Progress
- Dashboard real data wiring (Batch O2)
- Merchant detail enhancements (Batch O3)

### ⏳ Not Started
- Webhooks UI (Batch O4)
- Orders & Deliveries (Batch O5)
- Payouts real data (Batch O6)
- Inbox & Tickets (Batch O7)
- KYC real data + Disputes + Privacy (Batch O8)
- Rescue + Audit real data (Batch O9)

---

## Next Steps

**Immediate**: Start Batch O2 (Dashboard + Health)
1. Create dashboard overview page with real metrics
2. Create system health page
3. Wire summary APIs
4. Add time range picker to topbar
5. Remove all mock data from existing pages

**Then**: Proceed through batches O3-O9 sequentially

---

## Acceptance Criteria (Final)

- [ ] All pages use real data (no mocks)
- [ ] All write actions require auth + role + reason + audit
- [ ] All sensitive data is redacted
- [ ] All pages have loading/empty/error states
- [ ] Login never shows shell
- [ ] Middleware protects all routes
- [ ] Build passes with 0 errors
- [ ] Screenshots provided for all pages
- [ ] "Not configured" states driven by real checks
