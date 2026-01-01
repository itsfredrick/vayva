# Marketing/Admin Separation Refactor Plan

## 🎯 Executive Summary

**Problem**: Marketing site lives inside `merchant-admin/src/app/(marketing)`, causing:
- Conceptual coupling (marketing ≠ admin)
- Asset path issues (images/icons not visible)
- Deployment complexity
- Mental model confusion

**Solution**: Extract marketing into standalone `apps/marketing` with shared UI primitives.

---

## 📁 Proposed Folder Structure

```
vayva-platform/
├── apps/
│   ├── marketing/                    # NEW - Public-facing site
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (pages)/
│   │   │   │   │   ├── about/
│   │   │   │   │   ├── blog/
│   │   │   │   │   ├── careers/
│   │   │   │   │   ├── community/
│   │   │   │   │   ├── compare/
│   │   │   │   │   ├── contact/
│   │   │   │   │   ├── features/
│   │   │   │   │   ├── help/
│   │   │   │   │   ├── how-vayva-works/
│   │   │   │   │   ├── legal/
│   │   │   │   │   ├── marketplace/
│   │   │   │   │   ├── pricing/
│   │   │   │   │   ├── store-builder/
│   │   │   │   │   ├── templates/
│   │   │   │   │   ├── trust/
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   └── page.tsx       # Homepage
│   │   │   │   ├── privacy/
│   │   │   │   ├── terms/
│   │   │   │   ├── contact/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── globals.css
│   │   │   └── components/
│   │   │       └── marketing/
│   │   │           └── PremiumButton.tsx
│   │   ├── public/
│   │   │   ├── logos/
│   │   │   │   ├── vayva-logo.png
│   │   │   │   ├── partner-paystack.png
│   │   │   │   ├── youverify_logo.png
│   │   │   │   ├── 123design_logo.jpg
│   │   │   │   └── oral4_logo.png
│   │   │   ├── images/
│   │   │   │   ├── calm-solution.jpg
│   │   │   │   ├── chaos-problem.jpg
│   │   │   │   ├── mobile-showcase.png
│   │   │   │   ├── step-1-whatsapp.png
│   │   │   │   ├── step-2-templates.png
│   │   │   │   ├── step-3-builder.png
│   │   │   │   ├── step-4-payments.png
│   │   │   │   └── step-5-delivery.png
│   │   │   ├── og-image.png
│   │   │   ├── favicon.svg
│   │   │   └── robots.txt
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── merchant-admin/               # CLEANED - Admin only
│   │   ├── src/
│   │   │   └── app/
│   │   │       ├── (auth)/
│   │   │       ├── (dashboard)/
│   │   │       ├── (onboarding)/
│   │   │       ├── (marketing)/      # ❌ DELETE THIS
│   │   │       └── ...
│   │   └── public/                   # Admin-specific assets only
│   │
│   └── ops-console/                  # Unchanged
│
├── packages/
│   ├── ui/                           # ALREADY EXISTS - Shared components
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   └── ...
│   │   └── index.ts
│   │
│   └── shared/                       # ALREADY EXISTS - Shared utilities
│
└── pnpm-workspace.yaml
```

---

## 🔍 Root Cause Analysis: Missing Icons/Images

### Diagnosis

After analyzing the marketing page code, I identified **3 root causes**:

#### 1. **Lucide Icons Using `currentColor` on White Backgrounds**
```tsx
// Line 242, 260, etc.
<Zap className="w-6 h-6 text-white" />
<ShieldCheck className="w-6 h-6 text-white" />
```
**Problem**: Icons render white on white backgrounds in some sections.
**Fix**: Explicit color classes already applied correctly. ✅

#### 2. **Image Paths Are Correct But Assets May Not Load in Dev**
```tsx
// Lines 74, 94, 113, 132, 231, 284
<Image src="/partner-paystack.png" ... />
<Image src="/calm-solution.jpg" ... />
```
**Problem**: Next.js Image component requires assets in `/public`, which they are.
**Potential Issue**: When marketing moves to new app, paths stay the same but assets must move too.

#### 3. **SVG Inline Icons Missing Explicit Colors**
```tsx
// Line 145-157
<svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
</svg>
```
**Status**: Correctly using `stroke="currentColor"` with explicit `text-green-500`. ✅

### Verified Fix Strategy

The icons/images **should be visible** in the current setup. If they're not showing:

1. **Dev Server Issue**: Assets not being served from `/public`
2. **Build Issue**: Images not being optimized/copied
3. **Browser Cache**: Old build cached

**Test Command**:
```bash
# Clear .next cache and rebuild
rm -rf apps/merchant-admin/.next
pnpm dev --filter merchant-admin
```

---

## 📦 Migration Plan (3 PRs)

### PR #1: Create Marketing App Structure
**Goal**: Set up new `apps/marketing` without breaking existing site

**Steps**:
1. Create `apps/marketing` folder structure
2. Copy `package.json` from merchant-admin, update name to `"marketing"`
3. Copy `next.config.js`, `tailwind.config.ts`, `tsconfig.json`
4. Create empty `src/app/layout.tsx` and `src/app/page.tsx`
5. Add to `pnpm-workspace.yaml`:
   ```yaml
   packages:
     - "apps/*"
     - "packages/*"
   ```
6. Run `pnpm install` to register new workspace
7. Test: `pnpm dev --filter marketing` should start (blank page OK)

**Verification**:
- [ ] `pnpm dev --filter marketing` runs without errors
- [ ] `pnpm build --filter marketing` succeeds
- [ ] No impact on existing merchant-admin

---

### PR #2: Move Marketing Content
**Goal**: Migrate all marketing routes and assets

**Files to Move**:

**From** `merchant-admin/src/app/(marketing)/` **To** `marketing/src/app/(pages)/`:
- `about/` → `about/`
- `blog/` → `blog/`
- `careers/` → `careers/`
- `community/` → `community/`
- `compare/` → `compare/`
- `contact/` → `contact/`
- `features/` → `features/`
- `help/` → `help/`
- `how-vayva-works/` → `how-vayva-works/`
- `legal/` → `legal/`
- `marketplace/` → `marketplace/`
- `pricing/` → `pricing/`
- `store-builder/` → `store-builder/`
- `templates/` → `templates/`
- `trust/` → `trust/`
- `layout.tsx` → `(pages)/layout.tsx`
- `page.tsx` → `(pages)/page.tsx`

**From** `merchant-admin/public/` **To** `marketing/public/`:
- `partner-paystack.png` → `logos/partner-paystack.png`
- `youverify_logo.png` → `logos/youverify_logo.png`
- `123design_logo.jpg` → `logos/123design_logo.jpg`
- `oral4_logo.png` → `logos/oral4_logo.png`
- `vayva-logo.png` → `logos/vayva-logo.png`
- `calm-solution.jpg` → `images/calm-solution.jpg`
- `chaos-problem.jpg` → `images/chaos-problem.jpg`
- `mobile-showcase.png` → `images/mobile-showcase.png`
- `step-*.png` (5 files) → `images/`
- `og-image.png` → `og-image.png`
- `favicon.svg` → `favicon.svg`

**Update Image Paths**:
```tsx
// Before
<Image src="/partner-paystack.png" ... />

// After
<Image src="/logos/partner-paystack.png" ... />
```

**Components to Move**:
- `merchant-admin/src/components/marketing/PremiumButton.tsx` → `marketing/src/components/marketing/PremiumButton.tsx`
- `merchant-admin/src/components/seo/SchemaOrg.tsx` → `marketing/src/components/seo/SchemaOrg.tsx`

**Verification**:
- [ ] `pnpm dev --filter marketing` shows full homepage
- [ ] All images visible (check browser DevTools Network tab)
- [ ] All icons render with correct colors
- [ ] No 404 errors in console
- [ ] Lighthouse score > 90 (Performance, Accessibility)

---

### PR #3: Clean Merchant-Admin & Add Redirects
**Goal**: Remove marketing from admin, add redirect strategy

**Steps**:
1. Delete `merchant-admin/src/app/(marketing)/` entirely
2. Remove marketing assets from `merchant-admin/public/`
3. Add redirect in `merchant-admin/next.config.js`:
   ```js
   async redirects() {
     return [
       {
         source: '/',
         destination: 'https://vayva.io', // or keep localhost:3001 for dev
         permanent: false,
       },
       {
         source: '/about',
         destination: 'https://vayva.io/about',
         permanent: true,
       },
       // ... repeat for all marketing routes
     ];
   }
   ```
4. Update `merchant-admin/package.json` scripts:
   ```json
   {
     "dev": "next dev -p 3000",
     "build": "next build"
   }
   ```
5. Update `marketing/package.json` scripts:
   ```json
   {
     "dev": "next dev -p 3001",
     "build": "next build"
   }
   ```

**Verification**:
- [ ] `merchant-admin` no longer contains marketing routes
- [ ] Accessing `/` on merchant-admin redirects appropriately
- [ ] Both apps can run simultaneously on different ports
- [ ] `pnpm build --filter merchant-admin` succeeds
- [ ] `pnpm build --filter marketing` succeeds

---

## 🛠️ Build Commands

### Development
```bash
# Run marketing site
pnpm dev --filter marketing

# Run merchant admin
pnpm dev --filter merchant-admin

# Run both simultaneously
pnpm dev --filter marketing --filter merchant-admin
```

### Production Build
```bash
# Build marketing
pnpm build --filter marketing

# Build merchant-admin
pnpm build --filter merchant-admin

# Build all apps
pnpm build
```

### Verification
```bash
# Test marketing build
cd apps/marketing
pnpm build
pnpm start

# Test merchant-admin build
cd apps/merchant-admin
pnpm build
pnpm start
```

---

## 🎨 Design System Sharing Strategy

### Shared Components (via `@vayva/ui`)
- ✅ `Button` - Already shared
- ✅ `Icon` - Already shared
- ⚠️ `PremiumButton` - Marketing-specific, keep in marketing app

### Shared Tokens (via `packages/ui` or `packages/theme`)
```ts
// packages/theme/tokens.ts
export const colors = {
  brand: {
    green: '#22C55E',
    slate: '#0F172A',
    gray: '#64748B',
  },
};
```

### Import Pattern
```tsx
// In marketing/src/app/page.tsx
import { Button } from '@vayva/ui';
import { PremiumButton } from '@/components/marketing/PremiumButton';
```

---

## 🚨 Risk Mitigation

### Potential Issues

1. **Broken Links Between Apps**
   - **Risk**: Marketing links to `/signup` which is in merchant-admin
   - **Fix**: Use full URLs or environment variables
   ```tsx
   <Link href={`${process.env.NEXT_PUBLIC_ADMIN_URL}/signup`}>
   ```

2. **SEO Impact**
   - **Risk**: Moving routes changes URLs
   - **Fix**: 301 redirects in old location, sitemap updates

3. **Shared Component Drift**
   - **Risk**: Marketing and Admin diverge in design
   - **Fix**: Enforce imports from `@vayva/ui`, not local copies

4. **Asset Duplication**
   - **Risk**: Same logo in multiple `/public` folders
   - **Fix**: Shared assets in `packages/ui/public`, symlink or copy during build

---

## ✅ Success Criteria

### Functional
- [ ] Marketing site accessible at `localhost:3001` (or production domain)
- [ ] Merchant-admin accessible at `localhost:3000`
- [ ] All images load correctly (0 404s)
- [ ] All icons visible with correct colors
- [ ] No broken internal links

### Performance
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 95
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s

### Build
- [ ] `pnpm build --filter marketing` succeeds
- [ ] `pnpm build --filter merchant-admin` succeeds
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Bundle size < 500KB (marketing)

---

## 📸 Required Screenshots

### Before (Current State)
1. Marketing homepage with broken/missing images
2. Browser DevTools Network tab showing 404s
3. Marketing route inside merchant-admin file tree

### After (Post-Refactor)
1. Marketing homepage with all images visible
2. Browser DevTools Network tab showing 200s for all assets
3. Separate `apps/marketing` and `apps/merchant-admin` in file tree
4. Lighthouse report showing scores > 90

---

## 🎯 Next Steps

1. **Review this plan** - Confirm approach aligns with vision
2. **Execute PR #1** - Create marketing app structure
3. **Execute PR #2** - Move content and assets
4. **Execute PR #3** - Clean merchant-admin
5. **Deploy** - Update deployment configs for two apps

**Estimated Time**: 
- PR #1: 30 minutes
- PR #2: 2 hours (careful asset migration)
- PR #3: 1 hour
- Testing: 1 hour
**Total**: ~4.5 hours

---

## 📝 Notes

- This refactor maintains **zero design changes**
- All existing routes preserved (with redirects where needed)
- Shared UI components remain in `@vayva/ui`
- Marketing can deploy independently from admin
- Future: Marketing could move to separate domain (e.g., `vayva.io`)
