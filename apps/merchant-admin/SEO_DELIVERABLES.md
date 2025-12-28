# SEO INFRASTRUCTURE DELIVERABLES

This document confirms the implementation of the **Master SEO Infrastructure Prompt**.

## 1. Central Engine (`src/lib/seo/`)
-   **`config.ts`**: Strict `vayva.ng` domain, route classification (INDEXABLE vs NO_INDEX), and limits.
-   **`metadata.ts`**: The `constructMetadata` function that enforces canonicals and tags.
-   **`schema-templates.ts`**: Exact JSON-LD generators for all page types.
-   **`comparisons.ts`**: Data source for Shopify/Wix attack pages.
-   **`keywords.ts`**: Keyword strategy map for templates.

## 2. CI & Validation (`scripts/seo/`)
-   **`validate-manifest.js`**: enforcing:
    -   Title/Desc limits.
    -   Canonical absolutism.
    -   Schema presence.
    -   Forbidden route exclusion (`/dashboard`, `/auth`, etc.).

## 3. Dynamic Routes (`src/app/`)
-   **`api/__seo/manifest/route.ts`**: The "Truth Endpoint" for CI.
-   **`sitemap.ts`**: Dynamic sitemap generation.
-   **`robots.ts`**: Strict crawling rules.
-   **`(marketing)/compare/[competitor]/page.tsx`**: The Attack Strategy implementation.

## 4. Usage
Run the validation suite:
```bash
# 1. Start App
pnpm dev

# 2. Fetch Manifest
curl http://localhost:3000/api/__seo/manifest > manifest.json

# 3. Validate
node scripts/seo/validate-manifest.js manifest.json
```

**Status**: READY FOR PRODUCTION CI.
