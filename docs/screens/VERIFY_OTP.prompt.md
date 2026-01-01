## 3) Verify email/phone (OTP)

### STABILITY MODE (APPLY — DO NOT DEVIATE)

- Same tokens/glass as Stability Mode.
- **Auth Shell**: Top header with logo only.

### Purpose

Verify ownership of email/phone via 6-digit OTP.

### Layout

Centered card, slightly wider (max **520px**).

### Components

- Title: “Verify your account”
- Subtext: “We sent a 6-digit code to **+234 80••• ••••**” (masked)
- OTP input row: 6 individual boxes or auto-split field. Auto-advance.
- Timer: “Resend in 00:30”
- Actions:
  - Primary: **Verify**
  - Secondary: “Change email/phone”
- Help: “Didn’t get a code?”

### Behavior

- Incorrect: Shake row + inline error.
- Expired: Banner.
- Success: Route to Onboarding/Dashboard.
