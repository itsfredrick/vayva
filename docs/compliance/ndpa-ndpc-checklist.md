# NDPA & NDPC Compliance Checklist (Internal)

_Version: 1.0 (2025-12-26)_

This document tracks Vayva's readiness for the **Nigeria Data Protection Act (NDPA) 2023** and preparation for potential **NDPC (Nigeria Data Protection Commission)** registration requirements.

## 1. NDPA 2023 Compliance Status

| Requirement                    | Status     | Action Item                                                                               |
| ------------------------------ | ---------- | ----------------------------------------------------------------------------------------- |
| **Lawful Basis Documentation** | ✅ Clear   | Defined in Privacy Policy (Contractual necessity, Legal obligation, Legitimate interest). |
| **Data Subject Rights**        | ✅ Mapped  | Protocol established for Access, Portability, Rectification, and Erasure.                 |
| **Breach Response Plan**       | ⚠️ Pending | Need to formalize the 72-hour notification window for "High Risk" breaches to NDPC.       |
| **Cross-Border Transfers**     | ✅ Defined | Utilizing standard contractual clauses for cloud infrastructure (AWS/Vercel).             |
| **DPA Templates**              | ⚠️ Draft   | Need a standard Data Processing Agreement (DPA) for Pro/Pro+ merchants.                   |

## 2. NDPC "Major Importance" Assessment

Under NDPA, organizations of "Major Importance" must register with the NDPC.
**Current Status:** Likely below threshold (2,000+ merchants current estimate).
**Trigger for Registration:**

- If Vayva processes data of over 10,000 data subjects (End Customers) within 6 months.
- If Vayva is deemed to perform "sensitive personal data processing" on a large scale.

_Reminder: Re-assess this threshold every quarter or when active merchant count exceeds 5,000._

## 3. Sub-Processor Inventory

The sub-processor list must be updated whenever a new third-party tool is integrated that touches PII:

- **Cloud:** Vercel / AWS
- **Database:** Prisma / Neon
- **Email:** Resend
- **Marketing:** (Logistics Connectors as added)

## 4. Documentation Requirements

- [ ] Maintain a Record of Processing Activities (ROPA).
- [ ] Conduct Data Protection Impact Assessments (DPIA) before launching major AI-driven features.
- [ ] Document all vendor contracts for NDPA compliance clauses.
