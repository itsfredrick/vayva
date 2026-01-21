# Incident Response Playbook

## 🚨 Emergency Contacts

| Role | Contact |
|---|---|
| **Primary On-Call** | [Link to Rotation Schedule] |
| **Engineering Lead** | `@eng-lead` (Slack) |
| **Security Officer** | `security@vayva.ng` |
| **Infrastructure** | `@devops` (Slack) |

---

## 1. Severity Matrix

Determine the severity level immediately upon verifying an incident.

| Level | Definition | Response Time | Examples |
|---|---|---|---|
| **SEV1** (Critical) | **System Down.** Critical business functions (Checkout, Login, Payments) are unavailable for >10% of users. Data breach confirmed. | **15 mins** | Database outage, Paystack/Stripe down, SSRF exploit, PII leak. |
| **SEV2** (Major) | **Major Degradation.** Critical features are failing intermittently or a non-critical but major flow (e.g., Onboarding) is blocked. | **1 hour** | High latency on checkout, email delivery failure, bulk upload broken. |
| **SEV3** (Minor) | **Minor Issue.** Business not blocked, but UX is degraded. No workaround available. | **4 hours** | Glitchy UI, minor styling issues, specific report failure. |
| **SEV4** (Trivial) | **Trivial.** Cosmetic issues, tyops, low-priority bugs. | **Next Sprint** | Typo in footer, button alignment off. |

---

## 2. Roles & Responsibilities

### Incident Commander (IC)

- **Who**: First primary on-call engineer to acknowledge.
- **Responsibilities**:
  - Declares SEV level.
  - Coordinates the response (assigns tasks).
  - Maintains the "War Room" (Slack channel).
  - Sends periodic updates (every 30m for SEV1).
  - **Does NOT write code** (delegates to Fixer).

### The Fixer

- **Who**: Assigned engineer(s).
- **Responsibilities**:
  - Investigates root cause.
  - Implements workaround/fix.
  - Communicates technical findings to IC.

### Comms Lead

- **Who**: Product Manager or Support Lead.
- **Responsibilities**:
  - Updates Status Page.
  - Emails affected customers.
  - Manages social media (if public outage).

---

## 3. Communication Templates

### A. Internal Slack Update (Every 30m)

```
**[SEV1] Checkout Unavailable**
**Status**: Investigating
**Impact**: 100% of store checkouts failing.
**Current Actions**:
- Database rolled back to T-1h snapshot.
- investigating bad migration.
**Next Update**: 15 mins.
```

### B. Status Page - Initial

**Title**: Protecting Platform Performance
**Message**: "We are currently investigating reports of issues with [Feature/Service]. Our engineering team is actively working to identify the cause. We will provide another update in 30 minutes."

### C. Status Page - Identified

**Title**: Identified: Database Connectivity Issue
**Message**: "We have identified the issue regarding [Feature]. A fix is being implemented. We expect service restoration within [Time Estimate]."

### D. Customer Email - Security Event (Draft)

**Subject**: Important Security Notice regarding your Vayva Account
**Message**:
> Dear Merchant,
>
> We detected unusual activity on your account on [Date]. As a precaution, we have reset your API keys and invalidated active sessions.
>
> **No sensitive financial data (cards, bank details) was compromised.**
>
> Please log in to reset your password and generate new API keys.
>
> Sincerely,
> The Vayva Security Team

---

## 4. Post-Mortem Process (RCA)

**Required for all SEV1 and SEV2 incidents.**

1. **Create Document**: Copy "Post-Mortem Template".
2. **Timeline**: Map out t-0 (start) to t-end (resolved).
3. **5 Whys**: Drill down to the root cause (not just "bad code", but "why was bad code merged?").
4. **Action Items**: Create Jira tickets for prevention (e.g., "Add rate limiting", "Update linter").
