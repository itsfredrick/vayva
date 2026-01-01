# Schema Analysis & Action APIs Adjustment Plan

## Current Schema Reality

### 1. **No "Merchant" Model - It's "Store"**
The codebase uses `Store` model, not `Merchant`. All action APIs need to be updated.

**Current Store Model** (lines 1923-2030):
```prisma
model Store {
  id                       String                    @id @default(uuid())
  name                     String
  slug                     String                    @unique
  logoUrl                  String?
  onboardingStatus         OnboardingStatus          @default(NOT_STARTED)
  plan                     SubscriptionPlan          @default(STARTER)
  isLive                   Boolean                   @default(false)
  // ... many other fields
  
  kycRecord                KycRecord?
  wallet                   Wallet?
  // ... many relations
}
```

**Missing Fields Needed**:
- ❌ `payoutsEnabled` - Does NOT exist
- ✅ `isLive` - EXISTS (can be used for active/inactive)
- ❌ No direct User relation (uses Tenant → Membership → User)

### 2. **OpsAuditEvent Schema**
**Current** (lines 4221-4231):
```prisma
model OpsAuditEvent {
  id          String   @id @default(uuid())
  opsUserId   String?
  OpsUser     OpsUser? @relation(fields: [opsUserId], references: [id])
  eventType   String
  metadata    Json?
  createdAt   DateTime @default(now())
}
```

**Issues**:
- ❌ Uses `opsUserId` not `actorId`
- ❌ Uses `eventType` not `action`
- ❌ No `targetType` field
- ❌ No `targetId` field
- ❌ No `reason` field

### 3. **KycRecord vs KycSubmission**
The schema uses `KycRecord` (singular, one-to-one with Store), not `KycSubmission` (plural).

---

## Solution Options

### Option A: Update Action APIs to Match Schema (RECOMMENDED)
Update the action API code to use existing schema fields.

**Changes Needed**:
1. Replace `prisma.merchant` with `prisma.store`
2. Replace `actorId` with `opsUserId`
3. Replace `action` with `eventType`
4. Store `targetType`, `targetId`, `reason` in `metadata` JSON field
5. Add `payoutsEnabled` field to Store model
6. Use `isLive` for active/inactive status

### Option B: Extend Schema to Match APIs
Add new fields to match the action API expectations.

**Changes Needed**:
1. Add fields to OpsAuditEvent:
   - `action` String
   - `targetType` String?
   - `targetId` String?
   - `reason` String?
2. Add `payoutsEnabled` Boolean to Store
3. Create KycSubmission model or use existing KycRecord

---

## Recommended Approach: Hybrid (Option A + Minimal Schema Changes)

### Step 1: Add Missing Field to Store
```prisma
model Store {
  // ... existing fields
  isLive                   Boolean                   @default(false)
  payoutsEnabled           Boolean                   @default(true)  // ADD THIS
  // ... rest of fields
}
```

### Step 2: Update Action APIs

#### Replace in ALL action API files:
```typescript
// OLD
await prisma.merchant.findUnique(...)
await prisma.merchant.update(...)

// NEW
await prisma.store.findUnique(...)
await prisma.store.update(...)
```

#### Update Audit Log Creation:
```typescript
// OLD
await prisma.opsAuditEvent.create({
  data: {
    actorId: user.id,
    action: "DISABLE_PAYOUTS",
    targetType: "Merchant",
    targetId: merchantId,
    reason: reason.trim(),
    metadata: { ... },
  },
});

// NEW
await prisma.opsAuditEvent.create({
  data: {
    opsUserId: user.id,
    eventType: "DISABLE_PAYOUTS",
    metadata: {
      targetType: "Store",
      targetId: storeId,
      reason: reason.trim(),
      merchantName: store.name,
      // ... other metadata
    },
  },
});
```

### Step 3: Update KYC Action
```typescript
// OLD
const latestKYC = merchant.kycSubmissions[0];

// NEW
const kycRecord = store.kycRecord;
```

### Step 4: Update Suspend Account Action
```typescript
// For user suspension, need to find user via tenant membership
const tenant = await prisma.tenant.findUnique({
  where: { id: store.tenantId },
  include: {
    TenantMembership: {
      where: { role: "OWNER" },
      include: { User: true },
    },
  },
});

const owner = tenant?.TenantMembership[0]?.User;
```

---

## Implementation Plan

### Phase 1: Schema Migration
```bash
# Add payoutsEnabled to Store
cd infra/db
# Edit schema.prisma
pnpm prisma migrate dev --name add_payouts_enabled_to_store
pnpm prisma generate
```

### Phase 2: Update Action APIs
1. Update disable-payouts/route.ts
2. Update enable-payouts/route.ts
3. Update force-kyc-review/route.ts
4. Update suspend-account/route.ts

### Phase 3: Update Frontend
1. Update merchant detail page to use "store" terminology
2. Update API calls to use correct field names

---

## Detailed File Changes

### 1. Schema Change
**File**: `infra/db/prisma/schema.prisma`

**Line 1940** (after `isLive`):
```prisma
  isLive                   Boolean                   @default(false)
  payoutsEnabled           Boolean                   @default(true)  // ADD THIS LINE
```

### 2. disable-payouts/route.ts
```typescript
// Line 28: Change merchant to store
const store = await prisma.store.findUnique({
  where: { id: merchantId },
  select: { id: true, name: true, payoutsEnabled: true },
});

// Line 34: Check store not merchant
if (!store) {
  return NextResponse.json({ error: "Store not found" }, { status: 404 });
}

// Line 40: Check store.payoutsEnabled
if (!store.payoutsEnabled) {
  return NextResponse.json(
    { error: "Payouts are already disabled for this store" },
    { status: 400 }
  );
}

// Line 49: Update store
await prisma.store.update({
  where: { id: merchantId },
  data: { payoutsEnabled: false },
});

// Line 57: Update audit log
await prisma.opsAuditEvent.create({
  data: {
    opsUserId: user.id,
    eventType: "DISABLE_PAYOUTS",
    metadata: {
      targetType: "Store",
      targetId: merchantId,
      reason: reason.trim(),
      storeName: store.name,
      previousState: { payoutsEnabled: true },
      newState: { payoutsEnabled: false },
    },
  },
});
```

### 3. force-kyc-review/route.ts
```typescript
// Line 28: Use Store and kycRecord
const store = await prisma.store.findUnique({
  where: { id: merchantId },
  select: {
    id: true,
    name: true,
    kycRecord: {
      select: { id: true, status: true },
    },
  },
});

// Line 48: Check kycRecord
const kycRecord = store.kycRecord;

if (!kycRecord) {
  return NextResponse.json(
    { error: "No KYC record found for this store" },
    { status: 400 }
  );
}

// Line 58: Update kycRecord
await prisma.kycRecord.update({
  where: { id: kycRecord.id },
  data: {
    status: "PENDING",
    reviewedAt: null,
    reviewedBy: null,
  },
});

// Line 70: Update audit log
await prisma.opsAuditEvent.create({
  data: {
    opsUserId: user.id,
    eventType: "FORCE_KYC_REVIEW",
    metadata: {
      targetType: "Store",
      targetId: merchantId,
      reason: reason.trim(),
      storeName: store.name,
      kycRecordId: kycRecord.id,
      previousStatus: kycRecord.status,
      newStatus: "PENDING",
    },
  },
});
```

### 4. suspend-account/route.ts
```typescript
// Line 28: Get store with tenant
const store = await prisma.store.findUnique({
  where: { id: merchantId },
  select: {
    id: true,
    name: true,
    isLive: true,
    tenantId: true,
    tenant: {
      include: {
        TenantMembership: {
          where: { role: "OWNER" },
          include: { User: { select: { id: true, email: true } } },
        },
      },
    },
  },
});

// Line 48: Check if already suspended
if (!store.isLive) {
  return NextResponse.json(
    { error: "Store is already suspended" },
    { status: 400 }
  );
}

// Line 56: Suspend store
await prisma.store.update({
  where: { id: merchantId },
  data: {
    isLive: false,
    payoutsEnabled: false,
  },
});

// Line 65: Suspend owner user (if exists)
const owner = store.tenant?.TenantMembership[0]?.User;
// Note: User model might not have isActive field
// May need to disable tenant membership instead

// Line 75: Update audit log
await prisma.opsAuditEvent.create({
  data: {
    opsUserId: user.id,
    eventType: "SUSPEND_ACCOUNT",
    metadata: {
      targetType: "Store",
      targetId: merchantId,
      reason: reason.trim(),
      storeName: store.name,
      userEmail: owner?.email,
      previousState: { isLive: true, payoutsEnabled: true },
      newState: { isLive: false, payoutsEnabled: false },
      severity: "CRITICAL",
    },
  },
});
```

---

## Migration Command

```bash
cd /Users/fredrick/Documents/GitHub/vayva-platform/infra/db

# Add payoutsEnabled field to Store model in schema.prisma
# Then run:
pnpm prisma migrate dev --name add_payouts_enabled_to_store

# Generate Prisma client
pnpm prisma generate

# Restart dev servers to pick up new schema
```

---

## Summary

**Schema Changes Required**: 1
- Add `payoutsEnabled Boolean @default(true)` to Store model

**API Files to Update**: 4
- disable-payouts/route.ts
- enable-payouts/route.ts
- force-kyc-review/route.ts
- suspend-account/route.ts

**Key Changes**:
- `prisma.merchant` → `prisma.store`
- `actorId` → `opsUserId`
- `action` → `eventType`
- `kycSubmissions` → `kycRecord`
- Store `targetType`, `targetId`, `reason` in `metadata` JSON

**Next Step**: Add `payoutsEnabled` field to schema and run migration.
