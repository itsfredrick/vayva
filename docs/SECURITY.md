# Vayva Security Hardening

## 1. Authentication & Session

- **Mechanism**: Currently utilizing Mock Auth for development.
- **Production Goal**: Switch to **NextAuth.js** or **Supabase Auth**.
- **Cookies**: Ensure `httpOnly`, `secure`, and `sameSite: 'lax'` attributes are set on session cookies.

## 2. Rate Limiting

- **Current State**: Middleware placeholder implemented in `src/middleware.ts`.
- **Implementation**: API routes (`/api/*`) should be protected using **Upstash Ratelimit** (Redis) or similar.
- **Limits**:
  - Auth endpoints: 5 req/min.
  - General API: 100 req/min.

## 3. Data Protection (PII)

- **KYC Data**: Store ID verification documents in secure storage (AWS S3 Private Bucket).
- **Logging**: Ensure `verification.service.ts` or any logger **redacts** sensitive fields (phone, email, ID number) before writing to logs.

## 4. CSRF & Headers

- **CSRF**: Next.js App Router handles CSRF via Server Actions automatically. For API routes, strictly validate `Origin` header.
- **Headers**: Middleware enforces:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`

## 5. Input Validation

- **Zod**: All API inputs are validated using shared Zod schemas (`@vayva/schemas`). This prevents injection attacks.
