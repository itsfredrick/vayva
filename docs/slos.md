# Service Level Objectives (SLOs)

## API Availability

- **Target**: 99.9% monthly uptime
- **Measurement**: Successful responses / total requests
- **Error Budget**: 43 minutes downtime per month
- **Alert**: < 99.5% over 1 hour

## Webhook Processing

- **Ingestion Success**: 99.9%
- **Processing Lag**: p95 < 2 minutes
- **Measurement**: Time from webhook received to processed
- **Alert**: p95 > 5 minutes for 10 minutes

## WhatsApp Sending

- **Success Rate**: 99% (excluding user-blocked)
- **Delivery Lag**: p95 < 30 seconds
- **Measurement**: Time from send request to provider ACK
- **Alert**: Success rate < 95% over 5 minutes

## Payment Processing

- **Webhook Processing**: p95 < 2 minutes
- **Success Rate**: 99%
- **Alert**: Success rate < 95% or lag > 10 minutes

## Delivery Status Updates

- **Processing Lag**: p95 < 10 minutes
- **Measurement**: Time from carrier webhook to merchant notification
- **Alert**: p95 > 30 minutes

## Campaign Sending

- **Throughput**: 1000 messages/minute
- **Failure Rate**: < 5%
- **Alert**: Throughput < 500/min or failure rate > 10%

## Queue Health

- **Backlog**: < 1000 pending jobs per queue
- **Processing Rate**: > 100 jobs/minute
- **Alert**: Backlog > 5000 for 10 minutes

## Database Performance

- **Connection Pool**: < 80% utilization
- **Query Latency**: p95 < 100ms
- **CPU**: < 70% average
- **Alert**: CPU > 80% for 5 minutes

## Error Budgets

- **Monthly Review**: Track SLO compliance
- **Burn Rate**: Alert if burning budget too fast
- **Postmortems**: Required for SLO violations

## Monitoring Dashboards

1. **Overview**: All SLOs at a glance
2. **API**: Request rates, latencies, errors
3. **Queues**: Backlog, processing rates, DLQ
4. **Providers**: WhatsApp, payments, delivery health
5. **Database**: Connections, queries, replication lag
