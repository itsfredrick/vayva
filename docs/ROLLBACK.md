# Rollback Procedure

**When to Rollback**:

- Critical bug impacting distinct User Journey (e.g., Checkout failed).
- Data corruption risk.
- Security vulnerability exposed.

## Execution

1.  **Identify Last Known Good**: Check `git tag`.
2.  **Revert**:
    - `vercel rollback` (if using Vercel).
    - OR `git revert` the merge commit and push to main/release (Forward Fix).
3.  **Database**:
    - If migration is destructive -> Maintenance Mode required.
    - If backward compatible -> App rollback is sufficient.

## Emergency Kill Switches

- **Environment Variables**:
  - `NEXT_PUBLIC_DISABLE_CHECKOUT=true`
  - `NEXT_PUBLIC_MAINTENANCE_MODE=true`

## Drill

- **Frequency**: Quaterly in Staging.
- **Process**: Deploy faulty build, execute rollback, verify recovery time.
