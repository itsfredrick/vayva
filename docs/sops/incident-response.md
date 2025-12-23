# Incident Response SOP

**Version:** 1.0  
**Last Updated:** January 1, 2025  
**Owner:** Engineering & Operations

---

## Purpose

This Standard Operating Procedure (SOP) defines how Vayva responds to platform incidents to ensure:
- Rapid resolution
- Clear communication
- Trust preservation
- Continuous improvement

---

## Incident Severity Levels

### SEV-1 (Critical)
**Definition:**
- Platform completely unavailable
- Payments or orders corrupted
- Data integrity at risk
- Security breach

**Response Time:** Immediate (24/7)  
**Notification:** All hands, leadership, status page

**Examples:**
- Database failure
- Payment processing down
- Data breach
- WhatsApp API complete outage

---

### SEV-2 (Major)
**Definition:**
- Partial service disruption
- Significant feature degradation
- WhatsApp connectivity issues
- Performance severely impacted

**Response Time:** Within 30 minutes  
**Notification:** On-call engineer, incident commander, status page

**Examples:**
- Dashboard slow or intermittent
- Order creation failing for subset of users
- WhatsApp message delays

---

### SEV-3 (Minor)
**Definition:**
- UI bugs
- Non-critical delays
- Cosmetic issues
- Single-user problems

**Response Time:** Next business cycle  
**Notification:** Support team, engineering backlog

**Examples:**
- Button misalignment
- Typos
- Non-blocking errors

---

## Incident Response Flow

### 1. Detection
**How Incidents Are Detected:**
- Automated monitoring alerts
- User reports via support
- Internal team discovery

**Immediate Actions:**
- Log incident in tracking system
- Assign incident commander (IC)
- Determine severity level

---

### 2. Containment
**Goal:** Stop further impact

**Actions:**
- Disable affected components if necessary
- Prevent data corruption
- Isolate problematic code/service
- Scale resources if needed

**Communication:**
- Notify incident commander
- Alert engineering team
- Prepare status page update

---

### 3. Communication

#### Internal Communication
- Use dedicated Slack channel: `#incidents`
- IC provides updates every 15 minutes (SEV-1) or 30 minutes (SEV-2)
- No speculation, only facts

#### External Communication (Status Page)
**Templates:**

**SEV-1 Initial:**
> We are currently investigating a service disruption affecting [component]. Our team is working to resolve this as quickly as possible. We will provide updates every 30 minutes.

**SEV-2 Initial:**
> We are experiencing degraded performance with [component]. Some users may experience [specific impact]. Our team is investigating.

**Resolution:**
> The issue affecting [component] has been resolved. All systems are now operational. We apologize for any inconvenience.

**Rules:**
- No blame language
- No technical jargon
- No promises of specific timelines unless certain
- Update timestamp on every change

---

### 4. Resolution

**Steps:**
- Identify root cause
- Apply fix (hotfix or rollback)
- Test in staging if possible
- Deploy to production
- Monitor for 30 minutes minimum

**Verification:**
- Confirm metrics return to normal
- Test affected workflows
- Get user confirmation if applicable

---

### 5. Post-Incident Review

**Timing:** Within 48 hours of resolution

**Attendees:**
- Incident commander
- Engineering lead
- Product manager
- Support lead (if customer-facing)

**Agenda:**
1. **Timeline:** What happened and when
2. **Root Cause:** Why it happened
3. **Impact:** Who was affected and how
4. **Response:** What went well, what didn't
5. **Action Items:** Preventive measures

**Deliverable:**
- Internal incident report (not public)
- Action items with owners and deadlines
- Update runbooks if needed

**No Blame:**
- Focus on systems, not individuals
- Psychological safety is paramount

---

## Roles and Responsibilities

### Incident Commander (IC)
- Coordinates response
- Makes decisions
- Communicates updates
- Owns post-incident review

### On-Call Engineer
- First responder
- Technical investigation
- Implements fixes

### Engineering Lead
- Escalation point
- Resource allocation
- Strategic decisions

### Support Lead
- Customer communication
- Ticket management
- User impact assessment

---

## Escalation Path

```
SEV-3 → Support Team → Engineering Backlog
SEV-2 → On-Call Engineer → Incident Commander → Engineering Lead
SEV-1 → All Hands → Incident Commander → Engineering Lead → CEO
```

---

## Tools and Systems

### Monitoring
- Uptime monitoring: [Tool TBD]
- Error tracking: [Tool TBD]
- Performance metrics: [Tool TBD]

### Communication
- Internal: Slack `#incidents`
- External: Status page at vayva.shop/status
- Alerts: PagerDuty or similar

### Documentation
- Incident log: [System TBD]
- Runbooks: Internal wiki
- Post-mortems: Secure storage

---

## Status Page Update Cadence

### SEV-1
- Initial: Within 5 minutes of detection
- Updates: Every 15-30 minutes
- Resolution: Immediate

### SEV-2
- Initial: Within 15 minutes
- Updates: Every 30-60 minutes
- Resolution: Within 2 hours of fix

### SEV-3
- No status page update unless customer-facing

---

## Communication Principles

### Do:
- Be honest and transparent
- Provide specific impact details
- Give realistic timelines
- Apologize for inconvenience
- Thank users for patience

### Don't:
- Speculate on causes
- Blame individuals or vendors
- Make promises you can't keep
- Use technical jargon
- Minimize user impact

---

## Appendix: Incident Classification Examples

### SEV-1 Examples
- Complete platform outage
- Payment processing failure
- Data breach or leak
- Database corruption

### SEV-2 Examples
- Dashboard unavailable
- WhatsApp sync delays >1 hour
- Order creation failing for >10% of users
- Significant performance degradation

### SEV-3 Examples
- UI rendering issues
- Single user account problems
- Non-critical feature bugs
- Cosmetic issues

---

## Review and Updates

This SOP should be reviewed:
- After every SEV-1 incident
- Quarterly for continuous improvement
- When tools or processes change

**Document Owner:** Head of Engineering  
**Last Review:** January 1, 2025  
**Next Review:** April 1, 2025

---

**For incident reporting:**  
Email: incidents@vayva.shop  
Slack: #incidents
