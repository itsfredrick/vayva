# Remaining Placeholders (Post-MVP)

The following items are functional Stubs/Mocks that must be replaced with real infrastructure for Production V1.0.

## 1. Authentication

- **Current**: Mock Auth (Username/Password always works or simple check).
- **Required**: Integration with **NextAuth.js** (Auth.js) or **Supabase Auth**.
- **Impact**: Merchant Admin, Ops Console.

## 2. Database

- **Current**: In-memory / Hardcoded mock data in `src/services/*.service.ts`.
- **Required**: **PostgreSQL** (Prisma) connectivity.
- **Impact**: All Apps.

## 3. Payments

- **Current**: Mock Paystack initialization (simulated success).
- **Required**: Real **Paystack API** keys (`pk_live_...`) and Webhook handling for verification.
- **Impact**: Storefront Checkout, Ops Wallet.

## 4. WhatsApp

- **Current**: UI for "Agent Settings".
- **Required**: **WhatsApp Cloud API** Webhook integration for real-time messaging.
- **Impact**: Server (Worker).

## 5. File Storage

- **Current**: Placeholder URLs / Local assets.
- **Required**: **AWS S3** or **UploadThing** for product image hosting/KYC docs.
- **Impact**: Merchant Admin (Product Upload, KYC).
