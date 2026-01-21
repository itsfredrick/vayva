# Recovery Drills (Tabletop Exercises)

## 🎲 Overview

These scenarios should be run quarterly by the engineering team to practice "muscle memory" for incident response.

---

## Scenario A: "Black Friday Blackout"

**Situation**: It's Black Friday. Traffic is 10x normal. Suddenly, checkout success rate drops to 0%.

### Discussion Points

1. **Detection**: How would we know? (Datadog/Sentry blocks? Customer support?)
2. **Triage**: Who becomes Incident Commander?
3. **Investigation**:
    - Is it Paystack? (Check their status page).
    - Is it our DB? (Check CPU/Connection pool).
4. **Mitigation**:
    - Enable "Queue Mode"?
    - Disable heavy features (Reports/Exports) via KillSwitch?

---

## Scenario B: "The Bad Migration"

**Situation**: A deploy just went out. 5 minutes later, the `Order` table is locked. All writes are failing.

### Discussion Points

1. **Rollback**: How fast can we revert the code? (Vercel Rollback).
2. **Database**: How do we kill the hung migration?
3. **Data Integrity**: Did we lose data during the lock? How do we check?

---

## Scenario C: "API Key Leak"

**Situation**: A security researcher emails us claiming they found valid API keys in a public GitHub repo.

### Discussion Points

1. **Validation**: Verify the keys work.
2. **Revocation**: How do we revoke the specific keys without breaking legitimate apps?
3. **Rotation**: How do we force rotation for the affected merchant?
4. **Communication**: What do we say to the merchant? (See `incident-response.md` templates).
