## 2) Create account (Sign up)

### STABILITY MODE (APPLY — DO NOT DEVIATE)

- **Dark mode only**. Background token `#142210` with subtle dark abstract/gradient + overlay 85–92%.
- **Primary** `#46EC13`, **Text** `#FFFFFF`.
- **Glass panels:** `rgba(20,34,16,0.70)` blur **20px**, border `1px solid rgba(255,255,255,0.08)`, radius **16px**.
- **Auth Shell**: Top header with logo only, no sidebar.

### Purpose

Create a merchant owner account (v1), then verify email/phone.

### Layout

Centered auth card (glass); step indicator "Step 1 of 2".

### Components

- Title: “Create your Vayva account”
- Inputs:
  1. Full name
  2. Business name
  3. Email or phone
  4. Password
  5. Confirm password
- Optional toggle: “I want to receive product updates”
- Checkbox: “I agree to Terms & Privacy”
- Primary CTA: **Create account**
- Secondary link: “Already have an account? Log in”

### Validation

- Password: Min 8 chars, 1 uppercase OR number.
- Confirm password must match.

### Behavior

- Success: Route to **Verify OTP**.
- Error: Inline "This email/phone is already registered".
