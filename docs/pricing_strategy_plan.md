# Pricing Strategy & Feature Differentiation Plan

## 1. Executive Summary

To clearly differentiate the **Starter** and **Pro** plans, we will gate high-value "Growth" features while keeping "Essential" operation features free. This ensures beginners can start easily, but scaling businesses are compelled to upgrade.

We will leverage existing capabilities (Team, Analytics) and introduce specific "Power-Ups" inspired by open-source patterns.

## 2. Feature Comparison Matrix

| Feature | Starter Plan (₦0/mo) | Pro Plan (₦15,000/mo) | "Pull" / Tech Strategy |
| :--- | :--- | :--- | :--- |
| **Team Members** | 1 Admin (Owner) | **Unlimited Staff & Roles** | Built-in `settings/team` (Gate via Middleware) |
| **Domain** | `vayva.shop/[store]` | **Custom Domain** (`.com`) | Built-in `settings/domains` + Vercel Domains API |
| **Analytics** | Last 7 Days Overview | **30-Day History + Funnels** | Built-in `analytics/` (Gate date range queries) |
| **Marketing** | Basic Transactional Emails | **Campaigns & Newsletters** | **React Email** (Open Source Templates) |
| **Recovery** | None | **Abandoned Cart Audit** | **BullMQ** (Redis Queue for bg jobs) |
| **Support** | Email Only | **Priority Chat** | **Chatwoot** (Open Source Suite integration) |

## 3. Recommended Open Source "Power-Ups"

The user asked for open-source projects to "pull" to add unique value.

### A. Marketing: [React Email](https://react.email) (The "Mailchimp" Killer)

* **Why**: Instead of paying for Mailchimp, we build a "Marketing Center" inside Vayva using React Email.
* **Pro Feature**: "Send Beautiful Newsletters".
* **Tech**: Store templates in `apps/transactional/emails`. Pro users get access to the "Campaign Builder" UI.

### B. Automation: [BullMQ](https://bullmq.io) (The "Zapier" Engine)

* **Why**: Pro users want automation (e.g., "Send SMS if order > ₦50k").
* **Pro Feature**: "Smart Workflows".
* **Tech**: Use BullMQ (Redis) to schedule background jobs for Pro stores.

### C. Advanced Charts: [Tremor](https://tremor.so)

* **Why**: The current charts are good, but Tremor offers "Executive Dashboards".
* **Pro Feature**: "CFO Dashboard" (Profit/Loss, Cohort Analysis).
* **Tech**: Copy/Paste Tremor components into a new `/analytics/pro` route.

## 4. Implementation Strategy (The "Gatekeeper")

We will implement a simple `FeatureGate` component and hook.

### Schema Update

```prisma
model Subscription {
  storeId   String   @id
  plan      PlanType // STARTER | PRO
  status    String   // ACTIVE | PAST_DUE
  expiresAt DateTime
}
```

### Usage in Code

```tsx
// Team Page
if (subscription.plan === 'STARTER' && members.length >= 1) {
  return <UpgradePrompt feature="Team" />;
}
```

## 5. Next Steps

1. **Approval**: Confirm this feature split.
2. **Implementation**:
    * Create `Subscription` model.
    * Implement `FeatureGate` logic.
    * Gate `settings/team`, `settings/domains`, and `analytics`.
    * (Optional) Implement "Marketing Center" using React Email.
