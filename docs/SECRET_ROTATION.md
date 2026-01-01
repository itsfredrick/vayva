# Secret Rotation Guide

**Frequency**:

- **Routine**: Every 90 Days.
- **Emergency**: Immediately upon suspected leak.

## Procedure

### 1. Database Credentials

1.  Provision new credentials in AWS RDS / Provider.
2.  Update `DATABASE_URL` in Vercel/Infra settings.
3.  Restart application services (Redeploy).
4.  Verify connectivity.
5.  Revoke old credentials.

### 2. API Keys (Paystack, WhatsApp)

1.  Generate new Secret Key in the Provider Dashboard.
2.  Update `PAYSTACK_SECRET_KEY` / `WHATSAPP_TOKEN` env vars.
3.  Redeploy.
4.  Test payment flow / messaging.
5.  Deactivate old key.

### 3. Application Secrets (JWT, NextAuth)

1.  Generate new random string (openssl rand -base64 32).
2.  Update `NEXTAUTH_SECRET` / `APP_SECRET`.
3.  **Impact**: All active user sessions will be invalidated (users must log in again).
4.  Redeploy.
