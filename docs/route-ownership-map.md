# Route Ownership Map (Phase A)

| Path | Current Owner (Observed) | Target Owner (Contract B) | Action Required |
| :--- | :--- | :--- | :--- |
| **`vayva.ng/`** | `merchant-admin` | `merchant-admin` | None |
| **`vayva.ng/login`** | `merchant-admin` | `merchant-admin` | None |
| **`vayva.ng/signup`** | `merchant-admin` | `merchant-admin` | None |
| **`vayva.ng/onboarding`** | `merchant-admin` | `merchant-admin` | Ensure Protected |
| **`vayva.ng/dashboard/*`** | `merchant-admin` | `merchant-admin` | Ensure Protected |
| **`admin.vayva.ng/`** | `merchant-admin` (Rewrite) | **DEPRECATED** | Remove Rewrite / DNS |
| **`vayva.ng/ops`** | 404 (Handled by Merchant) | `ops-console` | **REWRITE** rule in `merchant-admin` |
| **`ops.vayva.ng`** | `ops-console` (DNS) | **DEPRECATED** (as primary) | Retain as direct, but `vayva.ng/ops` is primary |
| **`*.vayva.ng`** | `merchant-admin` (Tenant Engine) | `storefront` | Vercel DNS Project Mapping |
| **`demo.vayva.ng/checkout`** | `storefront` | `storefront` | Ensure `storefront` handles checkout path |

## Conflict Resolution
1.  **Tenant Engine vs Storefront**: `merchant-admin` has logic to handle `*.vayva.ng` (lines 57-89). If `storefront` is deployed as a separate Vercel Project with `*.vayva.ng` domain, request never reaches `merchant-admin`. **Decision:** Keep logic in `merchant-admin` as fallback/dev, but rely on Vercel DNS for Prod.
2.  **Ops Rewrite**: We will add a rewrite in `merchant-admin/next.config.js`:
    ```js
    {
      source: '/ops/:path*',
      destination: process.env.OPS_CONSOLE_URL + '/ops/:path*'
    }
    ```
