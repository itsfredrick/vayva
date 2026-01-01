# Environment Variables

Copy `.env.example` to `.env` at the root.

## Core Configuration

```env
# Database (Used by Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/vayva?schema=public"

# Authentication (NextAuth / Custom)
NEXTAUTH_SECRET="super-secret-key-change-me"
NEXTAUTH_URL="http://localhost:3000"

# Feature Flags
ENABLE_WA_INTEGRATION="false"
ENABLE_PAYSTACK="false"
```

## Service Specifics

### Storefront

- `NEXT_PUBLIC_API_URL`: URL of the backend service (or mock).

### Ops Console

- `OPS_ADMIN_EMAILS`: Comma-separated list of allowed emails.

## Notes

- By default, apps run in **Mock Mode** if external keys are missing.
- `pnpm doctor` will verify if your `.env` file exists.
