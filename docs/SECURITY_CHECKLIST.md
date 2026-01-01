# Security Review Checklist

## Webhook Security

- [ ] **Payments (Paystack)**: HMAC-SHA512 signature verification
- [ ] **WhatsApp**: Message signature verification
- [ ] **Delivery (Kwik)**: Webhook authentication
- [ ] **Billing (Stripe)**: Signature verification with secret

## SSRF Protection

- [ ] Webhook URLs validated (HTTPS only in production)
- [ ] Private IP ranges blocked (10.0.0.0/8, 127.0.0.1, 192.168.0.0/16)
- [ ] Localhost/internal hostnames blocked
- [ ] URL scheme validation (no file://, ftp://)

## Rate Limiting

| Endpoint            | Limit | Window |
| ------------------- | ----- | ------ |
| Auth (login/signup) | 10    | 1 min  |
| Checkout            | 20    | 1 min  |
| WhatsApp send       | 60    | 1 min  |
| Campaign send       | 1000  | 1 min  |
| API (per key)       | 60    | 1 min  |
| Exports             | 5     | 1 hour |

## Secrets Management

- [ ] All secrets in environment variables
- [ ] No secrets in logs
- [ ] Secrets encrypted at rest
- [ ] API key secrets shown once only
- [ ] Webhook secrets encrypted in DB

## RBAC Audit

- [ ] No privilege escalation paths
- [ ] Admin impersonation restricted
- [ ] Billing actions require owner role
- [ ] Team invite requires admin role
- [ ] Refund approval requires finance role

## Authentication

- [ ] Session tokens secure (httpOnly, secure, sameSite)
- [ ] CSRF protection on state-changing endpoints
- [ ] JWT expiry enforced
- [ ] Password hashing (bcrypt/argon2)
- [ ] OTP rate limited

## Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' https://api.paystack.co https://graph.facebook.com;
frame-ancestors 'none';
```

## Dependency Audit

- [ ] `npm audit` run with no critical vulnerabilities
- [ ] Dependencies up to date
- [ ] No known CVEs in production dependencies

## Penetration Test Focus Areas

1. **Checkout token reuse**: Verify tokens are single-use
2. **Idempotency bypass**: Test duplicate requests don't double-charge
3. **Campaign abuse**: Rate limits prevent spam
4. **API key leakage**: Keys not exposed in client code
5. **File upload validation**: Only allowed image types

## Data Protection

- [ ] PII minimized in logs
- [ ] Customer data exportable
- [ ] Data deletion supported
- [ ] Consent recorded

## Sign-Off

| Reviewer         | Date | Status |
| ---------------- | ---- | ------ |
| Security Lead    |      | ☐ Pass |
| External Auditor |      | ☐ Pass |
