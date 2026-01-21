# Data Retention Policy

**Effective Date**: January 1, 2026

## 1. Overview

This document defines the retention periods for various types of data stored within the Vayva. Our goal is to balance operational needs with privacy compliance (GDPR/NDPR) and storage optimization.

## 2. Retention Schedule

| Data Type | Retention Period | Justification | Action |
|-----------|------------------|---------------|--------|
| **User Sessions** | 30 Days (Idle) | Security best practice to revoke stale access. | Delete |
| **Login History** | 90 Days | Security auditing and suspicious activity investigation. | Delete |
| **Audit Logs** | 1 Year | Compliance requirement for financial systems. | Archive -> Delete |
| **API Request Logs** | 14 Days | High volume, needed only for short-term debugging. | Delete |
| **Inactive Accounts** | 2 Years | User re-engagement window. | Anonymize |
| **Financial Records** | 7 Years | Legal requirement for tax and financial auditing. | **Keep Forever** |

## 3. Automated Cleanup

Data cleanup is performed nightly via the `cleanup-data.ts` job.

- **Dry Run**: `npm run cleanup:dry-run` (Preview deletion).
- **Execution**: `npm run cleanup:exec` (Permanent deletion).

## 4. Archival

Before permanent deletion of critical records (e.g., specific compliance logs), data may be exported to cold storage (e.g., S3 Glacier) if legally required. Currently, no cold storage archival is implemented for standard logs.
