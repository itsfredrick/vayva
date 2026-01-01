# Disaster Recovery Runbook

**Trigger**: Confirmed Data Loss, Database Corruption, or Critical Infrastructure Failure.

## 🚨 Immediate Actions (First 15 Minutes)

1.  **Acknowledge**: Create an incident in the internal tracker (`#incidents` channel).
2.  **Communicate**: Update Status Page -> "Investigating - Database Connectivity Issues".
3.  **Freeze**: Pause all deployments and background worker queues.
4.  **Assess**: Determine if this is a temporary outage or data corruption.

## 🛠️ Restore Procedure

If data restoration is required:

1.  **Select Backup**:
    - Identify the last known good state (consult `backup_receipt` table or Ops Dashboard).
    - Choose the specific `Backup ID`.

2.  **Provision Target**:
    - Do **NOT** restore over the existing production DB if possible.
    - Provision a new DB instance (e.g., `vayva-prod-recovery-v1`).

3.  **Execute Restore**:
    - Run the provider's restore command (e.g., `pg_restore`).
    - _Wait for completion._

4.  **Middleware Steps**:
    - Run migrations verify schema integrity: `npx prisma migrate deploy`.
    - Verification: Run smoke test script `scripts/smoke_test.sh`.

5.  **Switch Traffic**:
    - Update `DATABASE_URL` environment variable.
    - Restart application services.

## 📣 Communication Templates

**Status Update (External)**:

> "We are performing emergency maintenance on our database cluster. Service availability is impacted. No data loss is expected. Estimated recovery: [Time]."

**Internal Update**:

> "DR Procedure Initiated. Restoring from Snapshot [ID]. ETA 45 mins."

## ✅ Post-Mortem

- Save all logs.
- Document Root Cause.
- Schedule a review meeting within 24 hours.
