# Security Release Checklist

**Run before every production deployment.**

- [ ] **Dependency Audit**: Run `npm audit` (Status: Clean).
- [ ] **Secret Scan**: Run `scripts/audit_secrets.sh` (Status: Passed).
- [ ] **Tenant Isolation**: Run `npx playwright test tenant-isolation` (Status: Passed).
- [ ] **Configuration**:
  - [ ] `NODE_ENV` is production.
  - [ ] No placeholder secrets in ENV.
- [ ] **Headers**: Verify `Strict-Transport-Security` and `Content-Security-Policy` are present.
- [ ] **Audit Logs**: Verify sensitive actions are persisting to the Audit Log table.
