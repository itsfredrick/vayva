# API Conventions (v1)

## URL Structure

- Base URL: `https://api.vayva.ng/v1` (Usage: `/v1/...`)
- All resources are pluralized: `/products`, `/orders`

## Authentication

- **Merchant API**: `Authorization: Bearer <jwt_token>`
- **Public Storefront**: `X-Store-ID: <uuid>` or `X-Publishable-Key: <key>`
- **Webhooks**: Signature verification in `X-Paystack-Signature` or `X-Hub-Signature`.

## Pagination

Standard cursor-based or offset-based pagination.
Query params:

- `limit`: Number of items (default 20, max 100)
- `cursor`: Opaque string for next page
- `page`: Page number (if offset based)

Response envelope:

```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "limit": 20,
    "cursor": "next_page_token"
  }
}
```

## Sorting & Filtering

- Sorting: `?sort=createdAt:desc` (field:direction)
- Filtering: `?status=PAID&created_gte=2023-01-01`

## Idempotency

- Header: `Idempotency-Key: <uuid>`
- Required for all `POST` / `PATCH` requests affecting money or state.
- Server caches response for 24h.

## Error Format

Standardized error object matching `packages/schemas/src/enums.ts` error codes if possible.

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Product with ID 123 not found",
    "details": { "id": "123" }
  }
}
```

## Date & Time

- All inputs/outputs in ISO 8601 UTC: `2023-10-27T10:00:00Z`

## Security

- Rate Limiting: 1000 req/min for Merchants, 100 req/min for IP (Public)
- CORS: Strict allowlist for Merchant Dashboard.
