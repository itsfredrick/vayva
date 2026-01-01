# ✅ PR #1 Complete: Marketing App Structure Created

## What Was Done

### 1. Created New Marketing App
- **Location**: `apps/marketing/`
- **Port**: 3001 (merchant-admin stays on 3000)
- **Status**: ✅ Running successfully

### 2. Files Created
```
apps/marketing/
├── package.json          ✅ Minimal dependencies (React, Next, Lucide, @vayva/ui)
├── next.config.js        ✅ Clean config (no Sentry, no PWA)
├── tailwind.config.ts    ✅ Shared preset from @vayva/ui
├── tsconfig.json         ✅ Standard Next.js TypeScript config
└── src/
    └── app/
        ├── layout.tsx    ✅ Root layout with SEO metadata
        ├── page.tsx      ✅ Placeholder homepage
        └── globals.css   ✅ Minimal Tailwind setup
```

### 3. Verification Results
- [x] `pnpm install` completed successfully
- [x] `pnpm dev --filter marketing` runs without errors
- [x] Marketing app accessible at http://localhost:3001
- [x] No impact on existing merchant-admin (still running on 3000)
- [x] TypeScript configured automatically by Next.js

### 4. Current State
**Marketing App**: Shows placeholder page with message "Marketing content will be migrated here in PR #2"
**Merchant-Admin**: Unchanged, still contains `(marketing)` folder

---

## Next Steps: PR #2 - Move Marketing Content

### Files to Migrate (from merchant-admin to marketing)

#### Routes (15 directories + 2 files)
```bash
# From: apps/merchant-admin/src/app/(marketing)/
# To: apps/marketing/src/app/(pages)/

about/
blog/
careers/
community/
compare/
contact/
features/
help/
how-vayva-works/
legal/
marketplace/
pricing/
store-builder/
templates/
trust/
layout.tsx
page.tsx (713 lines - the main homepage)
```

#### Assets (22 files)
```bash
# From: apps/merchant-admin/public/
# To: apps/marketing/public/

# Logos (5 files)
partner-paystack.png → logos/
youverify_logo.png → logos/
123design_logo.jpg → logos/
oral4_logo.png → logos/
vayva-logo.png → logos/

# Images (8 files)
calm-solution.jpg → images/
chaos-problem.jpg → images/
mobile-showcase.png → images/
step-1-whatsapp.png → images/
step-2-templates.png → images/
step-3-builder.png → images/
step-4-payments.png → images/
step-5-delivery.png → images/

# Root assets
og-image.png
favicon.svg
apple-touch-icon.png
```

#### Components (2 files)
```bash
# From: apps/merchant-admin/src/components/
# To: apps/marketing/src/components/

marketing/PremiumButton.tsx
seo/SchemaOrg.tsx
```

### Required Code Changes in PR #2

1. **Update Image Paths** in `page.tsx`:
   ```tsx
   // Before
   <Image src="/partner-paystack.png" ... />
   
   // After
   <Image src="/logos/partner-paystack.png" ... />
   ```

2. **Update Component Imports**:
   ```tsx
   // Before
   import { PremiumButton } from "@/components/marketing/PremiumButton";
   
   // After (same, but now in marketing app)
   import { PremiumButton } from "@/components/marketing/PremiumButton";
   ```

3. **Fix Link Destinations** (if any point to admin routes):
   ```tsx
   // Before
   <Link href="/signup">
   
   // After
   <Link href={`${process.env.NEXT_PUBLIC_ADMIN_URL}/signup`}>
   ```

---

## Commands to Execute PR #2

### Step 1: Copy Routes
```bash
cd /Users/fredrick/Documents/GitHub/vayva-platform

# Create pages directory
mkdir -p apps/marketing/src/app/\(pages\)

# Copy all marketing routes
cp -r apps/merchant-admin/src/app/\(marketing\)/* apps/marketing/src/app/\(pages\)/
```

### Step 2: Copy Assets
```bash
# Create asset directories
mkdir -p apps/marketing/public/logos apps/marketing/public/images

# Copy logos
cp apps/merchant-admin/public/partner-paystack.png apps/marketing/public/logos/
cp apps/merchant-admin/public/youverify_logo.png apps/marketing/public/logos/
cp apps/merchant-admin/public/123design_logo.jpg apps/marketing/public/logos/
cp apps/merchant-admin/public/oral4_logo.png apps/marketing/public/logos/
cp apps/merchant-admin/public/vayva-logo.png apps/marketing/public/logos/

# Copy images
cp apps/merchant-admin/public/calm-solution.jpg apps/marketing/public/images/
cp apps/merchant-admin/public/chaos-problem.jpg apps/marketing/public/images/
cp apps/merchant-admin/public/mobile-showcase.png apps/marketing/public/images/
cp apps/merchant-admin/public/step-*.png apps/marketing/public/images/

# Copy root assets
cp apps/merchant-admin/public/og-image.png apps/marketing/public/
cp apps/merchant-admin/public/favicon.svg apps/marketing/public/
cp apps/merchant-admin/public/apple-touch-icon.png apps/marketing/public/
```

### Step 3: Copy Components
```bash
mkdir -p apps/marketing/src/components/marketing apps/marketing/src/components/seo

cp apps/merchant-admin/src/components/marketing/PremiumButton.tsx apps/marketing/src/components/marketing/
cp apps/merchant-admin/src/components/seo/SchemaOrg.tsx apps/marketing/src/components/seo/
```

### Step 4: Update Image Paths
```bash
# This will be done manually in the code editor
# Update all image src paths in apps/marketing/src/app/(pages)/page.tsx
```

### Step 5: Test
```bash
# Start marketing app
pnpm dev --filter marketing

# Visit http://localhost:3001
# Verify:
# - Homepage loads
# - All images visible
# - All icons render
# - No 404 errors in console
```

---

## Timeline Estimate

- **PR #2 Execution**: 2 hours
  - File copying: 15 minutes
  - Path updates: 45 minutes
  - Testing: 30 minutes
  - Fixing issues: 30 minutes

- **PR #3 (Cleanup)**: 1 hour
  - Delete marketing from merchant-admin
  - Add redirects
  - Final testing

**Total Remaining**: ~3 hours

---

## Current Status

✅ **PR #1**: COMPLETE
⏳ **PR #2**: Ready to execute
⏳ **PR #3**: Pending PR #2

**Next Command**: Review this plan, then execute PR #2 file migrations.
