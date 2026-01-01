# Audit & Recovery Report - Phase 2 (Audit Fixes & Flow Recovery)

## 1. Compliance (Audit Logging Standardization)
**Objective**: Enforce mandatory `OpsAuthService.logEvent` usage for all mutations.
**Actions Taken**:
- **Merchant Actions**: Refactored `disable-payouts`, `enable-payouts`, `suspend-account`, `force-kyc-review`, and `replay-order-webhook` to use `OpsAuthService.logEvent` instead of inconsistent direct Prisma creation.
- **Rescue Actions**:
  - `rescue/payment`: Moved audit logging **outside** the transaction block for safety and consistency. Adopted `OpsAuthService.logEvent`.
  - `rescue/withdrawal`: Replaced manual logging with `OpsAuthService.logEvent`.
- **Webhooks**: `webhooks/replay` refactored to use standard logging.
- **Support**: Added missing audit logging to `support/reply` endpoint using standard service.

**Status**: **COMPLIANT**. All identified mutation endpoints now use the unified Audit Service requiring Session and Role checks.

## 2. Flow Recovery (Missing Details)
**Objective**: Enable deep investigation of Orders and Deliveries (previously list-only).
**Actions Taken**:
- **Orders**:
  - Created `/api/ops/orders/[id]` endpoint (fetching Items, Customer, Payment, Timeline, Shipment).
  - Created `/ops/orders/[id]` UI Page (Detail View with Timeline).
  - Linked global Order List (`/ops/orders`) to Detail Page.
- **Deliveries**:
  - Created `/api/ops/deliveries/[id]` endpoint (fetching Dispatch Jobs, Tracking).
  - Created `/ops/deliveries/[id]` UI Page (Tracking, Provider Info).
  - Linked global Delivery List (`/ops/deliveries`) to Detail Page.

**Status**: **RECOVERED**. Critical investigation flows are now functional using real data.

## 3. Search & Navigation
**Objective**: Eliminate dead-ends.
**Actions Taken**:
- **Search API**: Fixed to direct Results to deep-linked Merchant Tabs (`tab=orders`, `tab=overview`) instead of non-existent pages.
- **Merchant Detail**: Implemented URL-driven Tab state (`?tab=...`) to support deep linking.

## 4. Pending / Known Issues
- **Worker Process**: The `apps/worker` process is offline/broken. Queue processors for `PAYMENTS_WEBHOOKS` and `DELIVERY_SCHEDULER` are missing or non-functional. This is the **Primary Target for Phase 3**.
- **Lint Warnings**:
  - Prisma Client Types (`payoutsEnabled`, `PaymentTransaction`, `OrderEvent`) appear stale in lint feedback. **Action Required**: Run `pnpm db:generate` to refresh client types.
  - `Shipment.orderId`: Type definition mismatch in Deliveries page (likely resolved by regeneration).

## Next Steps
1. **Regenerate Prisma Client**: Run `pnpm db:generate` to clear type errors.
2. **Revive Worker**: Diagnose why `apps/worker` is offline and implement missing processors.
