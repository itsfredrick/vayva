# KYC Partner Migration: Dojah -> Youverify

Per user request, the KYC partner references have been updated from Dojah to Youverify.

## 1. Asset Management

- **Logo Added**: `public/youverify_logo.png` (Used the image provided by the user).
- **Removed**: References to `partner-dojah.png` (The file itself might still be there, but it's no longer used in the code).

## 2. Code Updates

- **Environment Validation (`src/lib/env-validation.ts`)**:
  - Renamed `DOJAH_API_KEY` to `YOUVERIFY_API_KEY`.
  - Renamed `DOJAH_APP_ID` to `YOUVERIFY_APP_ID` (commented out as it wasn't strictly used in the new service).
  - Updated `KYC_ENABLED` feature flag to check for `YOUVERIFY_API_KEY`.

- **Marketing Page (`src/app/(marketing)/page.tsx`)**:
  - Swapped the "Identity Verified" partner logo from Dojah to Youverify.

- **KYC Verification Component (`src/components/kyc/KYCVerification.tsx`)**:
  - Added a "Powered by Youverify" footer with the new logo to the verification form.

## 3. Backend Verification

- **Service (`src/services/kyc.ts`)**: Confirmed it imports and uses `YouverifyProvider`.
- **Library (`src/lib/kyc/youverify.ts`)**: Confirmed it uses `process.env.YOUVERIFY_API_KEY` and points to `api.youverify.co`.

## Next Steps

- Ensure `YOUVERIFY_API_KEY` is added to the `.env` file (User/DevOps action).
- Test the KYC flow with valid Youverify credentials.
