# 🚀 Launch Checklist & Production Ops

**Project:** Vayva (Merchant Admin)

## 1. Environment Variables (Required)

Before deploying, ensure these variables are set in your platform (Vercel/Railway/etc).

| Variable                | Description                                          |
| :---------------------- | :--------------------------------------------------- |
| `DATABASE_URL`          | PostgreSQL connection string                         |
| `NEXT_PUBLIC_APP_URL`   | Public URL (e.g. `https://admin.vayva.ng`)           |
| `NEXTAUTH_SECRET`       | Strong random string (run `openssl rand -base64 32`) |
| `NEXTAUTH_URL`          | Same as App URL (if not on Vercel)                   |
| `PAYSTACK_SECRET_KEY`   | Live Secret Key (starts with `sk_live_...`)          |
| `WHATSAPP_ACCESS_TOKEN` | System User Token                                    |

## 2. Domain & SSL

- [ ] Configure `admin.vayva.ng` in DNS (A / CNAME records).
- [ ] Verify SSL Auto-provisioning (Vercel handles this).
- [ ] Check `Strict-Transport-Security` header is present.

## 3. Webhooks Setup

**Paystack**:

- URL: `https://admin.vayva.ng/api/webhooks/paystack`
- Secret: Must match `PAYSTACK_SECRET_KEY` (or webhook-specific secret if configured).
- Events: `charge.success`, `transfer.success`, `refund.processed`.

**WhatsApp**:

- URL: `https://admin.vayva.ng/api/webhooks/whatsapp`
- Verify Token: Must match `WHATSAPP_VERIFY_TOKEN`.
- Subscribes to: `messages`.

## 4. Backups & Safety

- [ ] **Database**: Enable daily snapshots in Neon/Supabase/RDS.
- [ ] **Migrations**: Always run `prisma migrate deploy` during build phase.
- [ ] **Rollback**: To rollback, revert git commit and redeploy. If standard rollback fails due to DB changes, restore DB snapshot.

## 5. Admin Access

- Break-glass access is restricted to emails in `ADMIN_ALLOWLIST`.
- All admin actions are audited in `audit_log` table.

## 6. Incident Response

**If Webhooks Fail**:

1. Check `/api/health` for DB connectivity.
2. Check `webhook_event` table for error messages.
3. Replay failed webhooks from provider dashboard if idempotent.
