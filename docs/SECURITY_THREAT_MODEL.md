# Security Threat Model

## Assets

1.  **Merchant Data**: Orders, Customers, Inventory.
2.  **Identity**: Admin credentials, Customer sessions.
3.  **Secrets**: API Keys (Paystack, WhatsApp), Database URL.

## Top Threats & Mitigations

### 1. IDOR (Insecure Direct Object Reference)

- **Risk**: Merchant A accessing Merchant B's orders by guessing an ID.
- **Mitigation**:
  - **Tenant Isolation Layer**: All DB queries use `Repo` methods that strictly enforce `merchantId` filters.
  - **Audit**: "No Data Leak" test suite runs on every build.

### 2. Privilege Escalation

- **Risk**: A 'Viewer' role gaining 'Admin' capabilities.
- **Mitigation**:
  - **RBAC**: Server-side permission checks (`can(role, action)`) on every sensitive endpoint.
  - **Strict Mode**: Default deny policy for all new routes.

### 3. Supply Chain Attacks

- **Risk**: Malicious npm package.
- **Mitigation**:
  - **CI Scan**: `npm audit` runs on every PR.
  - **Lockfile**: Semver pinning.

### 4. Credential Leaks

- **Risk**: Secrets committed to git.
- **Mitigation**:
  - **Secret Scanner**: Automated grep checks in CI block commits with key patterns.
  - **Env Validation**: App fails to start if secrets are placeholder or missing.

## Residual Risk

- **Insider Threat**: Admin with DB access. (Mitigated by: Audit Logs, limited access).
- **Phishing**: Merchant credentials stolen. (Mitigated by: 2FA - Planned V2).
