# Lawyer Review Checklist & Handoff Package

**Version:** 1.0  
**Date:** January 1, 2025  
**Purpose:** Enable fast, accurate external legal review without redesigning documents

---

## Handoff Contents

Please review the following documents located in the `/legal` directory:

1. ✅ **Terms of Service** (`terms-of-service.md`)
2. ✅ **Privacy Policy** (`privacy-policy.md`)
3. ✅ **Acceptable Use Policy** (`acceptable-use.md`)
4. ✅ **Prohibited Items Policy** (`prohibited-items.md`)
5. ✅ **Refund Policy** (`refund-policy.md`)
6. ✅ **KYC & Safety Policy** (`kyc-safety.md`)

Supporting Documents:

- System Architecture Summary (see below)
- Data Flow Diagram (see below)
- Incident Response SOP (`/docs/sops/incident-response.md`)

---

## System Architecture Summary

### Platform Overview

Vayva is a **software infrastructure provider** that helps Nigerian merchants organize business activity conducted via WhatsApp.

### What Vayva Does:

- Provides order management tools
- Enables payment tracking (record-keeping only)
- Facilitates delivery coordination
- Generates business records and analytics

### What Vayva Does NOT Do:

- ❌ Act as a payment processor
- ❌ Touch, hold, or intermediate funds
- ❌ Act as a marketplace or escrow
- ❌ Own, control, or participate in merchant-customer transactions
- ❌ Provide financial services

**Critical Positioning:**

> Vayva operates as a **software infrastructure provider**, not a financial intermediary or marketplace.

### Technical Stack

- **Frontend:** Next.js (React)
- **Backend:** Node.js API
- **Database:** PostgreSQL
- **Infrastructure:** Cloud-hosted (Vercel/AWS)
- **WhatsApp Integration:** Meta Business API (read-only for order capture)

---

## Data Flow Diagram

```
┌─────────────┐
│  Merchant   │
│  (User)     │
└──────┬──────┘
       │
       │ 1. Registers account
       │ 2. Enters business data
       │ 3. Records transactions
       │
       ▼
┌─────────────────────┐
│  Vayva Platform     │
│  (Data Controller)  │
│                     │
│  - User accounts    │
│  - Transaction logs │
│  - Analytics        │
└──────┬──────────────┘
       │
       │ Data stored & processed
       │
       ▼
┌─────────────────────┐
│  Cloud Storage      │
│  (Data Processor)   │
│                     │
│  - Encrypted at rest│
│  - Access controlled│
└─────────────────────┘

External Sharing (Limited):
- Regulators: Only when legally required
- Infrastructure: DPA-protected vendors
- No third-party data sales
```

---

## Lawyer Review Checklist

Please confirm the following:

### A. Contract Law

- [ ] Terms of Service enforceable under Nigerian law
- [ ] Limitation of liability language acceptable and compliant
- [ ] Governing law clause (Nigerian law) valid
- [ ] Jurisdiction clause (Nigerian courts) appropriate
- [ ] Indemnification clauses enforceable
- [ ] Modification/termination rights reasonable

### B. Consumer Protection

- [ ] Refund policy compliant with Nigerian consumer law
- [ ] No misleading representations in marketing or terms
- [ ] Subscription billing terms clear and fair
- [ ] Cancellation rights properly disclosed
- [ ] No unfair contract terms

### C. Platform Liability

- [ ] Clear separation between Vayva and merchant transactions
- [ ] No implied escrow, agency, or payment processing role
- [ ] Merchant responsibility clauses sufficient
- [ ] Disclaimer of warranties appropriate
- [ ] Limitation of liability caps defensible

### D. Data Protection (NDPR)

- [ ] Lawful basis for processing clearly stated
- [ ] Data subject rights comprehensively covered
- [ ] Retention periods specified and reasonable
- [ ] Data controller identification clear
- [ ] International transfer safeguards adequate
- [ ] NDPC complaint mechanism included
- [ ] Cookie policy compliant

### E. AML / KYC

- [ ] KYC triggers legally defensible
- [ ] Suspension rights properly scoped
- [ ] No overreach into financial regulation
- [ ] Cooperation with authorities framework sound
- [ ] Identity verification requirements reasonable

### F. Prohibited Items

- [ ] List comprehensive for Nigerian context
- [ ] Enforcement mechanisms legally sound
- [ ] Reporting obligations clear
- [ ] No liability gaps for illegal merchant activity

### G. Intellectual Property

- [ ] User content ownership clear
- [ ] License grants appropriate
- [ ] IP infringement procedures adequate
- [ ] Trademark usage rights defined

### H. Miscellaneous

- [ ] Force majeure clause present
- [ ] Severability clause included
- [ ] Entire agreement clause appropriate
- [ ] Assignment rights properly restricted

---

## Instructions for Counsel

> **Important:** These documents are intended to be reviewed for **legal sufficiency**, not rewritten for tone or marketing purposes.
>
> Please flag:
>
> - Legal risks or gaps
> - Jurisdictional conflicts
> - Regulatory non-compliance
> - Unenforceable provisions
>
> We are **not** seeking:
>
> - Marketing copy edits
> - Tone adjustments
> - Stylistic preferences

---

## Expected Deliverables

Please provide:

1. **Redline Document** (if changes needed)
   - Track changes in Word or PDF
   - Include explanatory comments

2. **Risk Memo** (required)
   - Summary of key legal risks
   - Recommendations for mitigation
   - Priority level for each issue

3. **Compliance Confirmation Letter** (optional but preferred)
   - Confirmation of NDPR compliance
   - Confirmation of Nigerian law compliance
   - Any caveats or conditions

4. **Timeline**
   - Expected review completion date
   - Availability for follow-up questions

---

## Key Questions for Counsel

1. **CBN Licensing:** Do our activities trigger any CBN licensing requirements?
2. **Payment Processing:** Is our "record-keeping only" approach sufficient to avoid payment processor classification?
3. **Marketplace Liability:** Are our disclaimers adequate to avoid marketplace operator liability?
4. **NDPR Registration:** Do we need to register with NDPC as a data controller?
5. **AML Obligations:** What are our specific AML reporting obligations, if any?

---

## Contact Information

**For questions during review:**

**Vayva Inc.**  
Primary Contact: [Name]  
Email: legal@vayva.shop  
Phone: [To be provided]

**Technical Questions:**  
Engineering Lead: [Name]  
Email: engineering@vayva.shop

---

## Confidentiality

All materials in this package are confidential and subject to attorney-client privilege.

Please do not share outside your firm without our written consent.

---

## Timeline

**Requested Review Completion:** [Date]  
**Launch Target:** [Date]  
**Urgency Level:** High (pre-launch review)

---

**Thank you for your review. We look forward to your feedback.**
