# Typecheck Debt (Baseline)

This document tracks known TypeScript typecheck failures so they remain **explicit and actionable**.

## Policy
- CI runs typecheck across workspaces.
- Workspaces **not** listed in `.ci/typecheck-allowlist.txt` must pass typecheck.
- Workspaces in the allowlist are allowed to fail temporarily, but must be removed from the list as debt is paid down.

## Current allowlisted failures

| Workspace | Rough error count | Top root causes (initial) | Priority | Owner | Issue |
|---|---:|---|---|---|---|
| `merchant-admin` | ~1 | `vitest.config.ts` type incompatibility likely from duplicated Vite/Vitest/Rollup type trees (mismatched dependency graph) | P0 | Unassigned | TBD |
| `mobile` | ~126 | React Native / Expo Router typing incompatibilities: `Stack` JSX type mismatch (ReactNode types) and multiple `Text` props errors (e.g. `className` not in RN `TextProps`) | P0 | Unassigned | TBD |

## Notes
- Error counts and root causes will be updated after the first clean baseline run (CI + local parity).
