# Vayva Rescue System Runbook (Tier-3 Automated SRE)

**Status**: MVP (Read-Only)
**Audience**: Engineering On-Call, Ops Team

## Overview
Vayva Rescue is an AI-powered diagnostic agent designed to triage incidents during off-hours or high-load events. It operates in **READ-ONLY** mode, analyzing logs and request traces to identify root causes without attempting automated fixes (mutations).

## Capabilities
1.  **Triage**: Classifies incidents into `AUTH`, `DATABASE`, `PAYMENTS`, `DELIVERY`, `NETWORKING`, or `AI_LOGIC`.
2.  **Diagnostics**: Analyzes error snippets, stack traces, and context to determine root causes.
3.  **Remediation**: Suggests 3 step-by-step SAFE actions for a human operator.
4.  **Audit**: Logs every intake and analysis result to the `OpsAuditEvent` table.

## Guardrails (Non-Negotiable)
- **PII Redaction**: All input to the AI model is scrubbed of Emails, Phone Numbers, API Keys, Bearer Tokens, Credit Cards, SSH Keys, and JWTs.
- **Read-Only**: The system is explicitly prompted to NEVER suggest direct DB mutations (UPDATE/DELETE) without an approval process.
- **Audit Logging**: No rescue action occurs without a persisting record in the database (`SYSTEM_RESCUE_INTAKE`, `SYSTEM_RESCUE_RESULT`).

## How to Trigger
Currently, Rescue is triggered programmatically via the `RescueService.intakeIncident()` method.

```typescript
import { RescueService } from "@/lib/rescue/rescue.service";

await RescueService.intakeIncident({
  requestId: "req_12345",
  source: "PAYMENTS_SERVICE",
  errorSnippet: "PaymentIntent verification failed",
  sentryEventId: "event_abc"
});
```

*(Future Integration: Automated triggering via Sentry Webhooks)*

## Auditing & review
To review Rescue activity, query the `OpsAuditEvent` table:

```sql
SELECT * FROM "OpsAuditEvent" 
WHERE "eventType" IN ('SYSTEM_RESCUE_INTAKE', 'SYSTEM_RESCUE_RESULT')
ORDER BY "createdAt" DESC;
```

## Escalation Paths
The AI will suggest an escalation path. Standard mapping:
- **PAYMENTS**: `@eng-payments` (Urgent if success rate < 90%)
- **DELIVERY**: `@eng-logistics` (Urgent if dispatch failed)
- **DATABASE**: `@infra-on-call`
- **SECURITY**: `@security-team` (Immediate for `AUTH` leakage)

## Troubleshooting Rescue
If Rescue returns `FAILED` or `QUEUED`:
1.  Check `OPS_RESCUE_ENABLE` env var (must be "true").
2.  Check `GROQ_API_KEY_RESCUE` (must be valid).
3.  Review application logs for `[RescueService] Diagnosis failed`.
