# Backup & Disaster Recovery Runbook

**RPO (Recovery Point Objective)**: 1 Hour (Database), 24 Hours (Files)
**RTO (Recovery Time Objective)**: 4 Hours

## 1. Database Backups (Postgres)

We use a dual-strategy for database backups:

1. **Continuous WAL Archiving**: Managed by AWS RDS (Point-in-Time Recovery enabled for 7 days).
2. **Daily Logic Dumps**: `pg_dump` runs nightly to S3 `s3://vayva-backups/db/daily/`.

### Manual Backup Trigger

To verify backup capability or before dangerous migrations:

```bash
./scripts/db-backup.sh
```

## 2. Restore Procedure

### Full Point-in-Time Recovery (AWS RDS)

1. Log into AWS Console -> RDS.
2. Select Production DB -> Actions -> Restore to Point in Time.
3. Select time (e.g., 5 mins before incident).
4. Launch new instance `vayva-prod-recovery`.
5. Update `DATABASE_URL` in Vercel to point to new instance.

### Partial Table Restore (from Dump)

1. Download dump: `aws s3 cp s3://vayva-backups/db/daily/LATEST.sql .`
2. Restore locally: `psql -d local_restore -f LATEST.sql`
3. Export specific table: `pg_dump -t "Order" local_restore > orders_only.sql`
4. Restore to prod: `psql $DATABASE_URL -f orders_only.sql`

## 3. Incident Contacts

- **CTO**: <fredrick@vayva.ng>
- **DevOps Lead**: <ops@vayva.ng>
