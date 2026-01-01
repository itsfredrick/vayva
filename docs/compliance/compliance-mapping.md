# Compliance Mapping

**Version:** 1.0  
**Last Updated:** January 1, 2025  
**Purpose:** Define clear compliance boundaries for NDPR, CBN, and AML

---

## Core Positioning

> **Vayva operates as a software infrastructure provider, not a financial intermediary or marketplace.**

This positioning is **critical** and must appear in:

- Legal documents
- Investor decks
- Regulatory discussions
- Marketing materials
- Support communications

---

## 1. NDPR (Nigeria Data Protection Regulation)

### Vayva's Role

**Data Controller:** Yes  
**Data Processor:** Yes (limited scope)

### Compliance Measures

#### ✅ Implemented

- [x] Lawful basis documented (contractual, legal, legitimate interests)
- [x] Privacy policy published and accessible
- [x] Data subject rights process defined
- [x] Retention periods specified
- [x] NDPC complaint mechanism included
- [x] Cookie policy published

#### 🔄 In Progress

- [ ] NDPC registration (if required - pending legal confirmation)
- [ ] Data Protection Impact Assessment (DPIA) for high-risk processing
- [ ] Vendor Data Processing Agreements (DPAs)
- [ ] Employee data protection training

#### 📋 Ongoing

- [ ] Annual privacy policy review
- [ ] Data breach response procedures
- [ ] Regular security audits
- [ ] Data subject request handling

### What Vayva Does NOT Do

**No Data Resale:**

- We do not sell personal data to third parties
- No advertising or profiling for external parties

**No WhatsApp Scraping:**

- We do not scrape WhatsApp messages beyond functionality
- We do not access messages without merchant consent
- We do not store message content long-term

**No Surveillance:**

- We do not monitor merchant-customer conversations
- We do not use data for purposes beyond service provision

### Data Subject Rights

Users can request:

- **Access:** Copy of their data
- **Correction:** Fix inaccurate data
- **Deletion:** Remove data (subject to legal retention)
- **Portability:** Export data in machine-readable format
- **Objection:** Object to processing based on legitimate interests

**Response Time:** 30 days

---

## 2. CBN (Central Bank of Nigeria)

### Critical Positioning

**Vayva is NOT:**

- ❌ A payment processor
- ❌ A wallet provider
- ❌ A financial institution
- ❌ A payment service provider (PSP)
- ❌ A mobile money operator

### What This Means

**We Do NOT:**

- Touch, hold, or intermediate funds
- Process payments on behalf of merchants
- Provide payment gateway services
- Offer credit or lending
- Facilitate currency exchange

**We ONLY:**

- Record payment status entered by merchant
- Track payment metadata (amount, date, method)
- Generate payment reports for merchant use

### Compliance Strategy

**Stay Outside Licensing Scope:**

- No funds flow through Vayva
- No payment processing infrastructure
- Merchants use their own payment methods (cash, bank transfer, etc.)
- Vayva is record-keeping software only

### Regulatory Boundary

```
┌─────────────────────────────────────┐
│  Outside CBN Licensing Scope        │
│  (Vayva's Position)                 │
│                                     │
│  - Software tools                   │
│  - Record-keeping                   │
│  - Analytics                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Inside CBN Licensing Scope         │
│  (We Do NOT Do This)                │
│                                     │
│  - Payment processing               │
│  - Funds custody                    │
│  - Payment gateway                  │
│  - Mobile money                     │
└─────────────────────────────────────┘
```

### Key Question for Lawyer

**Does our "record-keeping only" approach keep us outside CBN licensing requirements?**

Expected Answer: Yes, but confirm with counsel.

---

## 3. AML / KYC (Anti-Money Laundering / Know Your Customer)

### Why KYC Exists at Vayva

**Not for regulatory compliance** (we're not a financial institution)

**But for:**

- Platform integrity
- Risk mitigation
- Fraud prevention
- Regulatory cooperation (if requested)

### KYC Triggers

We may request verification when:

1. **Suspicious Activity Detected**
   - Unusual transaction patterns
   - Prohibited items suspected
   - Fraud indicators

2. **High-Volume Operations**
   - Merchants processing large volumes
   - Multi-branch operations
   - Wholesale businesses

3. **Law Enforcement Requests**
   - Official requests for information
   - Court orders
   - Regulatory inquiries

### KYC Requirements

**Basic Tier (All Merchants):**

- Full name
- Email address
- Phone number
- Business name

**Enhanced Tier (Triggered):**

- Government-issued ID
- Business registration documents
- Proof of address
- Bank account verification

### Enforcement Powers

**We Can:**

- Request verification documents
- Restrict features until verification
- Suspend accounts for non-compliance
- Terminate for illegal activity

**We Cannot:**

- Force merchants to provide documents without cause
- Share data with authorities without legal basis
- Discriminate based on verification status

### AML Reporting

**No Automatic Reporting:**

- We do not automatically report to EFCC or other authorities
- We only report when legally compelled (court order, subpoena)

**Cooperation Framework:**

- Respond to official requests within legal timeframes
- Provide only requested information
- Document all requests and responses

### Red Flags

We monitor for:

- Prohibited items sales
- Fraudulent activity patterns
- Identity theft indicators
- Money laundering signals (unusual patterns)

**Action:** Investigate → Verify → Suspend if necessary → Report if legally required

---

## 4. Other Regulatory Considerations

### Consumer Protection

**Nigerian Consumer Protection Council (CPC):**

- Refund policy compliant
- No misleading advertising
- Clear pricing and terms
- Fair contract terms

### Intellectual Property

**Copyright, Trademark:**

- Respect merchant IP
- DMCA-style takedown process
- No infringement facilitation

### Tax Compliance

**FIRS (Federal Inland Revenue Service):**

- VAT collection (if applicable)
- Corporate tax compliance
- Proper invoicing

---

## 5. Compliance Summary Table

| Regulation              | Vayva's Status        | Key Obligations                        | Risk Level |
| ----------------------- | --------------------- | -------------------------------------- | ---------- |
| **NDPR**                | Data Controller       | Privacy policy, data rights, retention | Medium     |
| **CBN**                 | Not Applicable        | Stay outside payment processing        | Low        |
| **AML/KYC**             | Voluntary (integrity) | KYC on triggers, cooperation           | Low        |
| **Consumer Protection** | Applicable            | Fair terms, refunds, transparency      | Medium     |
| **Tax**                 | Applicable            | VAT, corporate tax                     | Medium     |

---

## 6. Compliance Checklist

### Pre-Launch

- [x] Privacy policy published
- [x] Terms of Service published
- [x] Cookie consent implemented
- [ ] NDPC registration (if required)
- [ ] Lawyer sign-off on all policies

### Ongoing

- [ ] Quarterly privacy policy review
- [ ] Annual legal compliance audit
- [ ] Vendor DPA renewals
- [ ] Employee training updates

### Incident-Based

- [ ] Data breach response plan tested
- [ ] Law enforcement request procedures documented
- [ ] KYC escalation process defined

---

## 7. Key Contacts

**NDPR Compliance:**

- Nigeria Data Protection Commission (NDPC)
- Website: ndpc.gov.ng
- Email: info@ndpc.gov.ng

**CBN Inquiries:**

- Central Bank of Nigeria
- Website: cbn.gov.ng

**Legal Counsel:**

- [Firm Name]
- Contact: [Name]
- Email: [Email]

---

## 8. Compliance Philosophy

**Defensive, Not Aggressive:**

- We comply where required
- We do not overreach into regulated territory
- We maintain clear boundaries

**Transparent, Not Evasive:**

- We disclose our role clearly
- We cooperate with legitimate requests
- We do not hide behind technicalities

**Proactive, Not Reactive:**

- We anticipate regulatory questions
- We document our positioning
- We seek legal guidance early

---

**Last Reviewed:** January 1, 2025  
**Next Review:** April 1, 2025  
**Owner:** Legal & Compliance Team
