# Third-Party Risk Registry

**Last Updated**: January 2026

## 1. Critical Path Services

*Failure here causes immediate revenue loss or core system outage.*

| Service | Category | Usage | Failure Mode | Fallback/Mitigation |
|---------|----------|-------|--------------|---------------------|
| **Paystack** | Payments | Checkout, Subscriptions, Payouts | **Checkout Failure**: Users cannot pay. **Payout Failure**: Merchants cannot withdraw. | **Circuit Breaker**: Detect timeouts <br> **UI**: Show "Payment System Busy" error. <br> **Fallback**: None currently (Single PSP). |
| **Vercel (Hosting)** | Infrastructure | Hosting, Serverless Functions | **Total Outage**: Site unavailable. | **Status Page**: Check Vercel Status. <br> **Mitigation**: Multi-region (Enterprise plan only). |
| **Neon (Postgres)** | Database | Core Data (Orders, Users) | **Read/Write Failure**: App becomes read-only or totally unusable. | **Pooler**: Use Connection Pooling. <br> **Retry**: Client-side retries for transient errors. |
| **NextAuth / Auth.js** | Identity | Login, Session Management | **Login Failure**: Merchants cannot access dashboard. Storefronts (Guest checkout) unaffected. | **Session Cache**: Active sessions *may* survive short outages if JWT based. |
| **Vercel Blob** | Storage | Product Images, User Avatars | **Image Broken**: Products display placeholders. | **Alt Text**: Ensure robust alt text. |
| **BullMQ (Redis)** | Async Jobs | Webhook processing, Email sending | **Delayed Processing**: Emails late, Order status update delayed. | **Retry Queue**: Jobs persist in Redis until processed. |

## 2. Semi-Critical Services

*Failure degrades experience but core value remains.*

| Service | Category | Usage | Failure Mode | Fallback/Mitigation |
|---------|----------|-------|--------------|---------------------|
| **Resend** | Email | OTPs, Receipts, Alerts | **Delivery Failure**: Users miss notifications. | **Resend Logic**: App retries sending. <br> **UI**: "Check your spam" or "Resend Code" button. |
| **Groq / OpenAI** | AI | Marketing Copy, Chatbots | **Feature Unavailable**: "Generate Description" fails. | **Graceful Degradation**: Hide AI buttons or show "AI Unavailable". |

## 3. Non-Critical Services

*Failure is invisible to users or only affects internal teams.*

| Service | Category | Usage | Failure Mode | Fallback/Mitigation |
|---------|----------|-------|--------------|---------------------|
| **Sentry** | Observability | Error Tracking | **Blindness**: Team cannot see new errors. | None required (User flow unaffected). |
| **PostHog / Analytics** | Analytics | Usage Tracking | **Data Gap**: Missing stats for the outage window. | None required. |

## 4. Risk Mitigation Plan

1. **Duplicate PSP**: Future roadmap includes adding Stripe/Flutterwave as backup for Paystack.
2. **Circuit Breakers**: Implemented for Paystack and AI services to fail fast.
3. **Local Dev**: All services can be mocked or bypassed (e.g., Local Postgres) for development resilience.
