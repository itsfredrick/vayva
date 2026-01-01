# Performance Optimization Checklist

## Bundle Optimization

- [ ] Code splitting enabled for routes
- [ ] Dynamic imports for heavy components
- [ ] Tree shaking working
- [ ] Dead code eliminated
- [ ] Bundle analyzer reviewed

## Bundle Size Targets

| Bundle     | Target  | Actual |
| ---------- | ------- | ------ |
| Main JS    | < 200KB |        |
| Main CSS   | < 50KB  |        |
| Vendor     | < 150KB |        |
| First Load | < 100KB |        |

## Image Optimization

- [ ] All images compressed
- [ ] WebP format used (with fallbacks)
- [ ] Lazy loading for below-fold images
- [ ] Proper sizing (srcset)
- [ ] CDN delivery

## Caching Strategy

- [ ] Static assets: Cache-Control max-age=1y
- [ ] API responses: appropriate cache headers
- [ ] Service worker caching active
- [ ] Product lists cached
- [ ] Theme resolution cached

## Database Performance

- [ ] Indexes on:
  - orders(store_id, created_at)
  - messages(conversation_id, created_at)
  - products(store_id, is_active)
  - inventory(product_id)
  - customers(store_id, phone)
- [ ] No N+1 queries
- [ ] Connection pooling configured
- [ ] Slow query logging enabled

## API Performance

- [ ] Response compression (gzip/brotli)
- [ ] Pagination on all list endpoints
- [ ] Query parameter filtering
- [ ] GraphQL persisted queries (if used)

## Mobile Performance (3G)

| Metric | Target | Actual |
| ------ | ------ | ------ |
| FCP    | < 2s   |        |
| LCP    | < 3s   |        |
| TTI    | < 4s   |        |
| CLS    | < 0.1  |        |

## Lighthouse Scores

| Page       | Performance | Accessibility | Best Practices | SEO |
| ---------- | ----------- | ------------- | -------------- | --- |
| Dashboard  | ≥80         | ≥90           | ≥90            | ≥90 |
| Storefront | ≥85         | ≥90           | ≥90            | ≥95 |
| Checkout   | ≥80         | ≥90           | ≥95            | ≥90 |

## Queue Performance

- [ ] Queue workers scaled appropriately
- [ ] Backlog monitoring active
- [ ] DLQ processing automated
- [ ] Job timeout settings reviewed

## Monitoring

- [ ] APM configured (e.g., New Relic, Datadog)
- [ ] Real User Monitoring active
- [ ] Core Web Vitals tracked
- [ ] Error tracking (Sentry) active
