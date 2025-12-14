## 5) Reset password (with OTP)

### STABILITY MODE (APPLY — DO NOT DEVIATE)
* Same tokens/glass.
* **Auth Shell**: Top header with logo only.

### Purpose
Set a new password after verifying reset code.

### Components
* Title: “Reset password”
* Subtext: “Enter the code we sent to **masked contact**”
* OTP input (6 digits)
* New password field + confirm
* Primary CTA: **Update password**
* Secondary: “Back to login”

### Behavior
* Success: Toast "Password updated", route to Login.
