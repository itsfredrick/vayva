# Risk Register (Ground Truth)

## Security risks
- **Committed `.env` files**: repo contains multiple `.env*` files at root and inside apps/infra. If any contain real secrets, this is critical. (Evidence: root directory listing shows `.env`, `.env.local`, `.env.production`, etc.)
- **Multiple auth models**: NextAuth in merchant-admin, gateway cookie token, ops session guard. Increased risk of inconsistent authorization.
- **Webhook validation unknown**: Payment webhook flows exist, but signature verification status is unknown without deeper scan.

## Stability risks
- **Lint disabled in multiple modules**: Several packages/apps/services have `"lint": "true"`.
- **Typechecking inconsistencies**: Root TS is strict, but some files disable TS checks (`@ts-nocheck` observed in worker/db client wrappers).
- **Port conflicts**: marketing and storefront scripts both use port `3001`.

## Maintainability risks
- **Dual API strategy**: Next route handlers + microservices + gateway; boundaries not clearly documented.
- **Inconsistent data fetching**: React Query (ops-console), SWR (merchant-admin), plus unknown patterns elsewhere.
- **Large volume of committed logs/reports**: repository root includes many `.log`/`.txt` artifacts.

## Priority order (recommended)
1. Secrets handling + env standardization
2. Auth strategy unification + consistent authorization guards
3. Lint/typecheck consistency
4. API boundary documentation (gateway vs Next handlers)
5. Repo hygiene and CI guardrails
