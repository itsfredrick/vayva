# SEO CI Implementation Guide

This system enforces the **Master SEO Directive** via automated gates.

## 1. The Gate (CI Job)

To validate SEO compliance, run:

```bash
# 1. Start dev server or build
pnpm build && pnpm start &

# 2. Fetch the Inventory Manifest
curl http://localhost:3000/api/__seo/manifest > seo-manifest.json

# 3. Run the Validator (Fails on error)
node scripts/seo/validate-manifest.js seo-manifest.json
```

## 2. Debugging SEO

Visit `http://localhost:3000/api/__seo/manifest` locally to see the JSON inventory of all key pages + their computed metadata.
If `indexable: true` appears for a dashboard route, the test will fail.

## 3. Adding New Pages

When creating a new page type (e.g. `src/app/blog/[slug]/page.tsx`):

1.  Import `constructMetadata`.
2.  Import `getArticleSchema`.
3.  Implement:

```tsx
export async function generateMetadata({ params }) {
    return constructMetadata({
        title: '...',
        type: 'blog',
        path: `/blog/${params.slug}`
    });
}
```

## 4. Keyword Strategy

Use `src/lib/seo/keywords.ts` to fetch the authorized keywords for any template page.
Do not invent new keywords without updating the map.
