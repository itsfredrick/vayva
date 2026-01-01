# ✅ Batch O4 Complete: Webhooks (View + Replay)

## Status: 100% COMPLETE

### Summary

Successfully implemented the Webhooks View and Replay functionality, focusing on Incoming Webhooks (`WebhookEvent`) from providers like Paystack, WhatsApp, and Kwik. Also fixed the Health API to correctly monitor these events.

---

## ✅ Completed Features

### 1. Webhooks List Page & API
**File**: `apps/ops-console/src/app/ops/(app)/webhooks/page.tsx`
**API**: `apps/ops-console/src/app/api/ops/webhooks/route.ts`

**Features**:
- ✅ List all incoming webhooks from `WebhookEvent` table
- ✅ Filter by Provider (Paystack, WhatsApp, Kwik)
- ✅ Filter by Status (RECEIVED, PROCESSED, FAILED)
- ✅ Search by Event ID, Type, or Store Name
- ✅ Real-time status badges
- ✅ Pagination

### 2. Webhook Detail Page & API
**File**: `apps/ops-console/src/app/ops/(app)/webhooks/[id]/page.tsx`
**API**: `apps/ops-console/src/app/api/ops/webhooks/[id]/route.ts`

**Features**:
- ✅ Full payload inspection with JSON syntax highlighting (simple pre/code block)
- ✅ Status, Provider, and Store metadata
- ✅ Error message display (if failed)
- ✅ "Replay Event" button (Guarded)

### 3. Webhook Replay Functionality
**API**: `apps/ops-console/src/app/api/ops/webhooks/[id]/replay/route.ts`

**Features**:
- ✅ Resets webhook status to "received"
- ✅ Clears `processedAt` and `error` fields
- ✅ Preserves `receivedAt` history
- ✅ Requires `OPERATOR` role
- ✅ Creates `WEBHOOK_REPLAY` audit log entry

### 4. Health API Monitoring Fix
**File**: `apps/ops-console/src/app/api/ops/health/route.ts`

**Fixes**:
- ✅ Switched from `WebhookDelivery` (outgoing) to `WebhookEvent` (incoming)
- ✅ Correctly queries `provider` field which exists on `WebhookEvent`
- ✅ Monitors failures for Paystack, WhatsApp, Kwik

---

## Implementation Details

### Model Usage
We targeted **Incoming Webhooks** as the primary "Ops" concern:
```prisma
model WebhookEvent {
  id          String   @id
  provider    String   // "paystack", "whatsapp"
  eventType   String
  status      String   // "received", "processed", "failed"
  payload     Json
  merchantId  String?  // Relation to Store
  // ...
}
```

### Replay Logic
Replay is implemented as a "Reset and Retry" pattern. The worker queue (external system) is expected to pick up "received" events that have no `processedAt` date.

```typescript
await prisma.webhookEvent.update({
  where: { id },
  data: {
    status: "received",
    error: null,
    processedAt: null,
  },
});
```

---

## 🧪 Testing Checklist

### Manual Interactions
- [x] Go to `/ops/webhooks` - List loads
- [x] Filter by "Paystack" - List updates
- [x] Click "View" on a webhook - Detail page loads
- [x] Check payload viewer - JSON is visible
- [x] Click "Replay Event" - Success toast appears
- [x] Go to `/ops/health` - Webhook section should show valid stats

### API Tests
```bash
# List
GET /api/ops/webhooks?provider=paystack

# Detail
GET /api/ops/webhooks/[ID]

# Replay
POST /api/ops/webhooks/[ID]/replay
```

---

## Next Steps

Proceed to **Batch O5: Search & Filter (Orders, Deliveries)** which will reuse the patterns established here for list views and filtering.
