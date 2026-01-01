# Vayva Local Development Setup

Welcome to the Vayva Monorepo! Follow this guide to get up and running in minutes.

## Prerequisites

- Node.js >= 18.x
- pnpm >= 9.x
- Docker (optional, for real DB)

## Quick Start (One Command)

1. **Clone & Install**

   ```bash
   git clone <repo-url>
   cd vayva
   pnpm install
   ```

2. **Validate Environment**
   Run the doctor script to check port availability and env config.

   ```bash
   pnpm doctor
   ```

3. **Start Everything**
   This starts all apps (Merchant Admin, Storefront, Marketplace, Ops) in parallel.
   ```bash
   pnpm dev
   ```

## Access Points

| App                | Port | URL                   | Description                         |
| ------------------ | ---- | --------------------- | ----------------------------------- |
| **Merchant Admin** | 3000 | http://localhost:3000 | For Sellers to manage stores        |
| **Storefront**     | 3001 | http://localhost:3001 | Public customer shopping experience |
| **Marketplace**    | 3002 | http://localhost:3002 | Global landing & waitlist           |
| **Ops Console**    | 3003 | http://localhost:3003 | Internal Vayva administration       |

## Common Commands

- `pnpm build`: Build all apps and packages.
- `pnpm lint`: Run linting across the repo.
- `pnpm typecheck`: Run TypeScript validation.
- `pnpm test:smoke`: Ping health endpoints of running apps.
- `pnpm db:seed`: (Currently uses Mock Data) Resets/Prepares data.

## Troubleshooting

- **Ports in use?**
  Run `pnpm doctor` to see which ports are blocked.
- **Build errors?**
  Run `pnpm build` at root to identify the failing package.
