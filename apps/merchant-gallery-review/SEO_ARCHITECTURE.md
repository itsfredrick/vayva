# Vayva SEO Architecture (v1)

This system implements the **Master SEO Directive** to complete with Shopify/Wix.
It enforces strict rules for metadata, canonicals, and indexing.

## 1. Core Components

### Central Engine (`src/lib/seo/metadata.ts`)

The `constructMetadata` function is the **only** way to generate page metadata.
It enforces:

- **Canonical URLs**: Automatically generated from `path`.
- **Title/Desc Limits**: Warns if >60 or >155 chars.
- **NoIndex Rules**: Automatically applied to 'auth', 'dashboard', 'preview' types.

### Configuration (`src/lib/seo/config.ts`)

Contains the "hard attributes" of the site:

- `siteUrl`: Used for all canonicals/OG.
- `INDEXABLE_TYPES`: Whitelist of pages allowed in search.

## 2. Usage Guide

### Server Pages / Layouts

Instead of exporting a raw Metadata object, use the constructor:

```tsx
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "Selling Online Made Easy",
  description: "Create your store in minutes...",
  path: "/pricing", // Becomes https://vayva.africa/pricing
  type: "pricing", // Whitelisted for indexing
  image: "/pricing-og.png",
});
```

### Protected Pages (Dashboard/Auth)

The engine automatically handles `noindex` based on type:

```tsx
export const metadata = constructMetadata({
  title: "Dashboard",
  description: "Manage your store",
  path: "/admin",
  type: "dashboard", // Automagically sets robots: { index: false }
});
```

## 3. Schema Markup

Use `src/lib/seo/schema.ts` generators to create JSON-LD objects.
Do not manually type JSON strings.

## 4. Next Steps to Full Compliance

- [ ] Refactor `SchemaOrg.tsx` to use new generators.
- [ ] Apply engine to `apps/merchant-admin/src/app/(auth)/layout.tsx`.
- [ ] Apply engine to `apps/merchant-admin/src/app/admin/layout.tsx`.
- [ ] Implement Dynamic Sitemap.
