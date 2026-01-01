# Authorization Rules

## Audience Separation

We strictly separate authentication contexts using the `aud` claim in JWTs.

| Audience      | Description       | Access Scope                                    |
| :------------ | :---------------- | :---------------------------------------------- |
| `merchant`    | Sellers & Staff   | Tenant-scoped data (Store A cannot see Store B) |
| `customer`    | Marketplace Users | My Orders, Profile, Public Listings             |
| `ops`         | Vayva Internal    | Global visibility, Moderation, System Config    |
| `ops-pre-mfa` | MFA Pending       | Only access to `/mfa/verify`                    |

## Tenant Isolation (Merchants)

- **Header**: `x-store-id` is required for store-specific operations.
- **Validation**: Middleware checks if `user.memberships` includes `x-store-id`.
- **Failure**: Returns `403 Forbidden` if user is not a member of the requested store.

## Role Based Access Control (RBAC)

### Merchant Roles

- **OWNER**: Can delete store, manage billing, invite admins.
- **ADMIN**: Can manage products, orders, settings, staff.
- **STAFF**: Can manage orders, view products. (Cannot change settings).

### Ops Roles

- **OPS_ADMIN**: Superuser. Can ban stores, refund any transaction.
- **OPS_AGENT**: Can view transactions, moderate listings, approve AI actions.
