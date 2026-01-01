# Production Rollout Plan

## Phase 1: Internal Dogfood (Week 1)

- Deploy to staging environment
- 3-5 internal team members use as merchants
- Monitor all metrics and logs
- Fix any blocking issues

## Phase 2: Pilot Merchants (Week 2-3)

- 5 hand-picked pilot merchants
- Direct support channel (WhatsApp group)
- Daily check-ins
- Feature flags:
  - `kwik_integration: true` (if ready)
  - `marketplace_directory: false`
  - `campaigns_auto_approve: false`
  - `premium_templates: false`

## Phase 3: Limited Rollout (Week 4-5)

- 50 merchants
- Support via in-app chat + email
- Weekly metrics review
- Enable features based on stability:
  - `marketplace_directory: true`
  - `campaigns_auto_approve: true` (for trusted merchants)

## Phase 4: General Availability (Week 6+)

- Open signups
- Marketing launch
- Full feature set enabled
- 24/7 monitoring

## Feature Flags

| Flag                     | Default | Description                 |
| ------------------------ | ------- | --------------------------- |
| `kwik_integration`       | false   | Enable Kwik delivery        |
| `marketplace_directory`  | false   | Show store in directory     |
| `campaigns_auto_approve` | false   | Skip approval for campaigns |
| `premium_templates`      | false   | Access to premium themes    |
| `ai_suggestions`         | true    | AI message suggestions      |
| `refunds_enabled`        | true    | Allow refunds               |

## Rollback Plan

### Quick Rollback (< 5 min)

1. Revert deployment to previous version
2. Notify affected merchants via banner

### Data Rollback (< 1 hour)

1. Restore from last backup
2. Replay missed webhooks from DLQ
3. Notify merchants of data restoration

## Monitoring During Rollout

### Key Metrics

- Signup success rate
- Payment success rate
- WhatsApp send success rate
- Order completion rate
- Error rate (5xx)

### Alert Thresholds

- Error rate > 5% for 5 min
- Payment success < 95%
- Queue backlog > 1000

## Communication Plan

### Pilot Merchants

- Personal onboarding call
- WhatsApp support group
- Feedback form

### Limited Rollout

- Email onboarding sequence
- In-app help center
- Support chat

### GA Launch

- Press release
- Social media campaign
- Merchant testimonials

## Post-Launch Review

- Week 2: Metrics review
- Week 4: Feature usage analysis
- Week 8: Churn analysis
- Month 3: Full retrospective
