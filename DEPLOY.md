
# Vayva Deployment Runbook

## 1. Prerequisites

- [ ] Vercel CLI installed (`npm i -g vercel`)
- [ ] PostgreSQL Database (Neon/Supabase) provisioned
- [ ] Redis (Upstash) provisioned
- [ ] Environment variables (.env.production) prepared

## 2. Environment Variables

Ensure the following are set in Vercel Project Settings:

```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://app.vayva.ng
NEXT_PUBLIC_API_URL=https://app.vayva.ng/api
NEXT_PUBLIC_MARKETPLACE_URL=https://vayva.ng
```

## 3. Database Migration

Run migrations against production database *before* promotion.

```bash
# 1. Connect to Prod DB locally or via CI
export DATABASE_URL=postgresql://prod...

# 2. Deploy Migrations
pnpm db:push

# 3. Generate Client
pnpm db:generate
```

## 4. Building & Deploying

We use TurboRepo for building apps.

### Staging

```bash
vercel deploy --prebuilt
```

*Verify functional tests on staging URL.*

### Production

```bash
vercel deploy --prod --prebuilt
```

## 5. Post-Deployment Verification

- [ ] Log in as Merchant Admin
- [ ] Check `/api/health` status
- [ ] Verify Redis connection (Rate limiting active?)
- [ ] Verify audit logs are being written

## 6. Rollback Procedure

If critical failure occurs:

1. Revert Vercel deployment:

   ```bash
   vercel rollback <deployment-id>
   ```

2. If DB migration caused issues, restore backup (Point-in-time recovery recommended).
