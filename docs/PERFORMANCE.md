# Vayva Performance Checklist

## 1. Image Optimization

- **Rule**: Always use `next/image` for images, especially product thumbnails.
- **Why**: Automatic resizing, lazy loading (LCP improvement), and WebP conversion.
- **Audit**: Check `apps/storefront/src/components/ProductCard.tsx` (or equivalent).

## 2. Code Splitting

- **Automatic**: Next.js App Router splits code by route automatically.
- **Dynamic Imports**: For heavy components (e.g., Charts in Analytics, Rich Text Editors), use `next/dynamic`.

## 3. Bundle Size

- **Shared UI**: Ensure `@vayva/ui` is tree-shakeable. Barrel files (`index.tsx`) must export cleanly.
- **Monitoring**: Run `@next/bundle-analyzer` periodically before big releases.

## 4. Fonts

- **Next Font**: Use `next/font/google` (Inter/Manrope) to prevent layout shifts (CLS). Fonts are self-hosted automatically at build time.

## 5. Caching

- **Fetch**: Use `{ next: { revalidate: 3600 } }` for semi-static data (e.g., product lists).
- **CDN**: Deploy to Vercel/Netlify/AWS CloudFront to serve static assets from the edge.
