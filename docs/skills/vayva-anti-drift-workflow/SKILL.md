---
name: vayva-anti-drift-workflow
description: Guardrails and workflow for Vayva platform changes (merchant-admin, ops-console, marketing, storefront) to prevent UI drift, orphan files, and mock data; emphasizes real wiring, minimal diffs, and clear QA reporting.
---

# Vayva Anti-Drift Workflow

Use this whenever working in any Vayva app to keep changes tight, on-brand, and fully wired.

## Core Defaults

- Scope guard: restate user goal + allowed surface; refuse out-of-scope edits without consent.
- UI stability: preserve existing layout/theme (green/black/white, official Vayva logos); no unsolicited redesigns.
- No mock data: wire buttons/forms to real APIs; if missing, add/patch API or mark TODO with reason.
- Orphan avoidance: every new page/component must be reachable via nav/CTA and backed by an endpoint; no “coming soon” dead ends.
- Minimal diffs: avoid reformatting; don’t touch unrelated lines; never revert user changes.
- Plan first (unless trivial): 2–4 steps; update after each major subtask.

## Platform Guardrails

- Onboarding (merchant-admin):
  - Steps: welcome → identity → business → visuals/branding → finance → logistics (skip for services/digital) → inventory (for product/menu/service/digital/events/courses/listings) → kyc → review → complete.
  - Enforce industry-tailored required/skip steps from `INDUSTRY_CONFIG`.
  - Completion: BVN + bank account name match; CAC required if registered; KYC verified for registered, pending allowed otherwise.
  - Preserve save/resume (`currentStep`, `requiredSteps`, `skippedSteps`).
- Templates/Control Center:
  - Apply via registry IDs; enforce plan tiers.
  - Upsert `TemplateManifest` + `storeTemplateSelection` + `storefrontDraft`; “Publish” must hit `/api/storefront/publish` with draft fallback.
  - Template gallery: filter by industry when required; show real success/error.
- Payments/KYC:
  - Use provided Paystack keys for account resolution; normalize/compare names strictly.
  - BVN/NIN/CAC rules tied to business type; status transitions PENDING→VERIFIED via ops where required.
- Ops Console:
  - KYC approval updates store onboarding status and wallet/store flags; no UI-only toggles.
- Dashboard/Nav:
  - Any new section gets sidebar/CTA link; routes must exist and use real data. Avoid placeholder metrics.
- Marketing:
  - Preserve hero/layout and assets; avoid deleting brand visuals unless requested; no orphaned feature pages.

## Execution Checklist

1) Understand & constrain: confirm goal, app/routes, APIs, design constraints.
2) Inventory: list existing pages/endpoints touched; note missing/broken/assumed.
3) Implement: smallest patches; comments only for non-obvious logic; keep brand colors.
4) Wire & validate: call real endpoints, ensure persistence/navigation, handle errors.
5) Report: concise summary (changes + files), fixed vs pending/blocked, risks, next steps.

## Communication Style

- Be concise, factual; lead with findings/fixes (4–6 bullets).
- Reference files as `path[:line]`; no large dumps.
- If blocked (missing API/access), state blocker and propose the minimal unblock.
