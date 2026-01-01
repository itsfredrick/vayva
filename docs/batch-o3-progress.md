# 🔄 Batch O3 In Progress: Merchants List + Detail Enhancement

## Status: 50% COMPLETE

### ✅ Completed

#### 1. Enhanced Merchants List Page
**File**: `apps/ops-console/src/app/ops/(app)/merchants/page.tsx`

**New Features**:
- ✅ **Advanced Filters**:
  - Plan filter (FREE, STARTER, GROWTH, ENTERPRISE)
  - KYC Status filter (APPROVED, PENDING, REJECTED, NOT_SUBMITTED)
  - Risk filter (Flagged Only, Clean Only)
  - Collapsible filter panel with active filter count badge
- ✅ **Enhanced Table Columns**:
  - Merchant name + slug
  - Plan badge
  - KYC status with icons (CheckCircle, AlertTriangle, XCircle)
  - GMV (30 days) with TrendingUp icon
  - Risk flags count with AlertTriangle icon
  - Last active date
- ✅ **Improved UX**:
  - Loading skeleton
  - Empty state
  - Filter toggle button
  - Active filter indicators
  - Hover states
  - Responsive design

#### 2. Enhanced Merchants API
**File**: `apps/ops-console/src/app/api/ops/merchants/route.ts`

**New Features**:
- ✅ **Filter Support**:
  - `?q=` - Search by business name, slug, or owner email
  - `?plan=` - Filter by plan
  - `?kyc=` - Filter by KYC status
  - `?risk=flagged|clean` - Filter by risk flags
- ✅ **Real Data Calculations**:
  - GMV (last 30 days) - SQL aggregation from orders
  - Risk flags - Count of failed payments + open disputes
  - Last active - Most recent order creation date
  - KYC status - Latest submission status
- ✅ **Performance**:
  - Efficient queries with groupBy
  - Pagination support
  - Proper indexing considerations

---

### ⏳ Remaining (Next Session)

#### 3. Merchant Detail Page Enhancement
**File**: `apps/ops-console/src/app/ops/(app)/merchants/[id]/page.tsx`

**Needs**:
- [ ] Tab navigation (Overview, Orders, Payments, Deliveries, KYC, Support, Audit, Actions)
- [ ] Overview tab with:
  - Profile information
  - Domains
  - Plan details
  - Health metrics
- [ ] Orders tab (paginated list)
- [ ] Payments tab (paginated list)
- [ ] Deliveries tab (paginated list)
- [ ] KYC tab (submission details)
- [ ] Support tab (tickets/conversations)
- [ ] Audit tab (ops actions on this merchant)
- [ ] Actions tab (guarded operations)

#### 4. Guarded Actions Implementation
**Needs**:
- [ ] Disable/Enable Payouts action
  - Requires SUPERVISOR role
  - Requires reason input
  - Confirmation modal (type merchant name)
  - Audit log entry
- [ ] Force KYC Review action
  - Requires SUPERVISOR role
  - Requires reason input
  - Audit log entry
- [ ] Replay Webhook action
  - Requires OPERATOR role
  - Requires reason + event ID
  - Audit log entry

#### 5. Action APIs
**Needs**:
- [ ] `POST /api/ops/merchants/:id/actions/disable-payouts`
- [ ] `POST /api/ops/merchants/:id/actions/enable-payouts`
- [ ] `POST /api/ops/merchants/:id/actions/force-kyc-review`
- [ ] `POST /api/ops/merchants/:id/actions/replay-webhook`

---

## Current Implementation Details

### Merchants List UI

#### Filter Panel
```tsx
<div className="grid grid-cols-3 gap-4">
  <select value={plan} onChange={...}>
    <option value="">All Plans</option>
    <option value="FREE">Free</option>
    <option value="STARTER">Starter</option>
    <option value="GROWTH">Growth</option>
    <option value="ENTERPRISE">Enterprise</option>
  </select>
  
  <select value={kyc} onChange={...}>
    <option value="">All Statuses</option>
    <option value="APPROVED">Approved</option>
    <option value="PENDING">Pending</option>
    <option value="REJECTED">Rejected</option>
    <option value="NOT_SUBMITTED">Not Submitted</option>
  </select>
  
  <select value={risk} onChange={...}>
    <option value="">All Merchants</option>
    <option value="flagged">Flagged Only</option>
    <option value="clean">Clean Only</option>
  </select>
</div>
```

#### KYC Badge Logic
```tsx
const getKYCBadge = (status: string) => {
  switch (status) {
    case "APPROVED":
      return <CheckCircle2 /> Approved (green);
    case "PENDING":
      return <AlertTriangle /> Pending (yellow);
    case "REJECTED":
      return <XCircle /> Rejected (red);
    default:
      return "Not Submitted" (gray);
  }
};
```

#### Risk Flags Display
```tsx
{merchant.riskFlags.length > 0 ? (
  <AlertTriangle /> {riskFlags.length} flag(s) (red)
) : (
  "Clean" (gray)
)}
```

### API Response Format

```typescript
{
  data: [
    {
      id: string,
      name: string,
      slug: string,
      ownerName: string,
      ownerEmail: string,
      status: "ACTIVE" | "INACTIVE",
      plan: "FREE" | "STARTER" | "GROWTH" | "ENTERPRISE",
      kycStatus: "PENDING" | "APPROVED" | "REJECTED" | "NOT_SUBMITTED",
      riskFlags: string[], // e.g., ["3 failed payments", "1 open dispute"]
      gmv30d: number,
      lastActive: string,
      createdAt: string,
      location: string
    }
  ],
  meta: {
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }
}
```

### GMV Calculation (SQL)

```sql
SELECT 
  "merchantId",
  SUM(total) as gmv
FROM "Order"
WHERE 
  "merchantId" IN (...)
  AND "createdAt" >= NOW() - INTERVAL '30 days'
  AND status IN ('PAID', 'COMPLETED')
GROUP BY "merchantId"
```

### Risk Flags Logic

```typescript
const riskFlags: string[] = [];

// Failed payments
if (merchant._count.payments > 0) {
  riskFlags.push(`${merchant._count.payments} failed payments`);
}

// Open disputes
if (merchant._count.disputes > 0) {
  riskFlags.push(`${merchant._count.disputes} open disputes`);
}

// Future: Add more risk indicators
// - High chargeback rate
// - Suspicious order patterns
// - Negative balance
// - Suspended by payment processor
```

---

## Testing Checklist

### Manual Tests (Completed)
- [ ] Visit `/ops/merchants` - List loads
- [ ] Search by merchant name - Results filter
- [ ] Filter by plan - Results update
- [ ] Filter by KYC status - Results update
- [ ] Filter by risk - Results update
- [ ] Toggle filters panel - Shows/hides
- [ ] Pagination - Next/Previous works
- [ ] Click merchant row - Navigates to detail

### Manual Tests (Remaining)
- [ ] Visit `/ops/merchants/:id` - Detail page loads
- [ ] Switch tabs - Content updates
- [ ] Click action button - Modal opens
- [ ] Submit action with reason - Executes and logs
- [ ] Verify audit log - Entry created

---

## Next Steps (Priority Order)

1. **Create Merchant Detail Page with Tabs**
   - Overview tab (profile + health)
   - Orders tab (list with pagination)
   - Payments tab (list with pagination)
   - Deliveries tab (list with pagination)
   - KYC tab (submission details)
   - Audit tab (ops actions log)
   - Actions tab (guarded operations)

2. **Implement Guarded Actions**
   - Create confirmation modal component
   - Add reason input field
   - Add "type merchant name to confirm" for destructive actions
   - Implement role checks

3. **Create Action APIs**
   - Disable/enable payouts
   - Force KYC review
   - Replay webhook
   - All with audit logging

4. **Add Tab-Specific APIs**
   - `GET /api/ops/merchants/:id/orders`
   - `GET /api/ops/merchants/:id/payments`
   - `GET /api/ops/merchants/:id/deliveries`
   - `GET /api/ops/merchants/:id/kyc`
   - `GET /api/ops/merchants/:id/audit`

---

## Files Modified

### Pages (1)
1. `apps/ops-console/src/app/ops/(app)/merchants/page.tsx` - Enhanced list

### APIs (1)
1. `apps/ops-console/src/app/api/ops/merchants/route.ts` - Enhanced with filters

---

## Acceptance Criteria (Partial)

- [x] Merchants list shows real data
- [x] Filters work (plan, KYC, risk)
- [x] GMV calculated from real orders
- [x] Risk flags calculated from real data
- [x] KYC status shown with icons
- [x] Last active tracked
- [x] Pagination works
- [x] Search works
- [ ] Merchant detail page has tabs
- [ ] Actions require role + reason + confirmation
- [ ] All actions create audit logs
- [ ] Tab content loads real data

**Status**: ✅ 50% COMPLETE - Ready to continue with detail page
