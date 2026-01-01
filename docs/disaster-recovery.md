# Disaster Recovery Playbook

## Backup Strategy

### Postgres Backups

- **Frequency**: Daily full backup + continuous WAL archiving
- **Retention**: 30 days
- **Storage**: S3 with encryption
- **Command**: `pg_dump -Fc vayva_prod > backup_$(date +%Y%m%d).dump`

### Object Storage

- **Lifecycle**: 90-day retention for exports/media
- **Versioning**: Enabled for critical buckets

## Recovery Procedures

### Database Restore

1. Stop all services
2. Restore from backup: `pg_restore -d vayva_prod backup.dump`
3. Replay WAL if needed
4. Verify data integrity
5. Restart services

**RTO**: 4 hours
**RPO**: 1 hour (with WAL)

### Monthly Restore Drill

- Restore to staging environment
- Verify data completeness
- Test application functionality
- Document any issues

## Incident Playbooks

### Payments Provider Outage

1. Enable kill-switch: `payments_new_checkouts_disabled`
2. Show merchant banner: "Payments temporarily unavailable"
3. Queue all payment webhooks for later processing
4. Monitor provider status page
5. When restored: disable kill-switch, process queued webhooks

### WhatsApp Webhook Outage

1. Webhooks will queue automatically (outbox pattern)
2. Monitor DLQ for failures
3. Check provider status
4. When restored: replay DLQ if needed

### Delivery Partner Outage (Kwik)

1. Enable kill-switch: `carrier_kwik_disabled`
2. Show merchant banner: "Kwik temporarily unavailable, use self-dispatch"
3. Queue dispatch jobs
4. When restored: disable kill-switch, process queue

### Queue Backlog Runaway

1. Check worker health
2. Scale workers horizontally
3. Pause low-priority queues (analytics, exports)
4. Monitor queue depth
5. Resume when stable

### Data Corruption Suspected

1. Stop writes immediately
2. Restore from last known good backup
3. Investigate corruption source
4. Apply fixes
5. Resume operations

## Monitoring & Alerts

### Critical Alerts

- Database CPU > 80% for 5 minutes
- Queue backlog > 10,000 for 10 minutes
- Webhook processing lag > 10 minutes
- Payment success rate < 95%
- API error rate > 5%

### On-Call Rotation

- Primary: Platform lead
- Secondary: Backend engineer
- Escalation: CTO

## Contact Information

- **Payments Provider**: support@paystack.com
- **WhatsApp**: business.whatsapp.com/support
- **Kwik**: support@kwik.delivery
- **AWS**: Premium support ticket
