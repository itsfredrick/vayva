# Release Train Process

**Goal**: Predictive, safe deployments to production.

## Environments

1.  **Local**: Developer workstations. Feature flags OFF.
2.  **Staging** (`staging.vayva.ng`): Mirror of Prod. Deployed automatically from `main`. Features ON for testing.
3.  **Production** (`vayva.ng`): Live environment. Deployed from `release/*` tags.

## Release Cadence

- **Standard**: Weekly (Wednesdays).
- **Hotfix**: As needed (requires VP approval).

## Deployment Steps

1.  **Freeze**: Code freeze on `main` 24h before release.
2.  **Gate Check**: Run `scripts/ci_gate.sh`. Must pass.
3.  **Smoke Test**: Run `tests/smoke.prod.spec.ts` against Staging.
4.  **Tag**: Create tag `release/vX.Y.Z`.
5.  **Deploy**: Push tag triggers Production deployment.
6.  **Verify**: Run Smoke Test against Production (Payment Step Skipped).

## Rollback

See `ROLLBACK.md`.

## Approval

- releases must be signed off by:
  - Engineering (Technical health)
  - Product (Feature verification)
