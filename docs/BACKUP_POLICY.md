# Backup Policy

**Effective Date**: 2025-12-18
**Owner**: Ops Team

## Objectives

- **RPO (Recovery Point Objective)**: **24 Hours** (Maximum data loss tolerated).
- **RTO (Recovery Time Objective)**: **4 Hours** (Maximum time to restore service).

## Strategy

1.  **Daily Full Backups**:
    - Automated daily snapshot of the primary Postgres instance.
    - Retained for **30 Days**.
2.  **Point-in-Time Recovery (PITR)**:
    - WAL retention enabled for 7 days (if provider supported).
    - Allows recovery to any second within the window.
3.  **Storage**:
    - Encrypted at rest (AES-256).
    - Stored in a separate region from the primary DB if possible (DR region).

## Access Control

- Access to backup artifacts is restricted to `Ops` and `Admin` roles.
- Restore operations require Audit Logging.

## Verification

- **Weekly Restore Drill**: A restore simulation is run against the staging environment to verify backup integrity.
