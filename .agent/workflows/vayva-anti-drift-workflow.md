---
description: Guardrails and execution workflow for all Vayva changes to prevent UI drift, orphaned features, mock data, and broken wiring across merchant-admin, ops-console, marketing, and storefront.
---

# Vayva Anti-Drift Workflow

This workflow is **always active** when reasoning, evaluating, solving, or building anything in the Vayva codebase.

It enforces production discipline across:

* merchant-admin
* ops-console
* marketing
* storefront

The goal is **zero UI drift, zero mock data, zero orphaned features**.

---

## 1. Scope & Intent Guard (FIRST STEP)

Before doing anything:

* Restate the user’s goal in 1–2 sentences.
* Explicitly list:

  * App(s) affected
  * Routes/pages affected
  * APIs involved
* Refuse to touch anything outside this scope unless the user explicitly approves.

Never silently expand scope.

---

## 2. UI Stability Rules (NON-NEGOTIABLE)

* Preserve existing layout, spacing, and component hierarchy.
* Preserve Vayva brand:

  * Colors: green / black / white
  * Official logos only
* No unsolicited redesigns.
* No visual “cleanup” unless explicitly requested.

If UI is wrong but not requested to change:
→ Call it out, do not fix it.

---

## 3. No Mock Data Rule (HARD RULE)

* Never introduce mock, fake, placeholder, or static data.
* Every button, form, or toggle must:

  * Call a real API, OR
  * Persist real state, OR
  * Be blocked with a TODO that explains:

    * What API is missing
    * Why it’s blocked
    * Where it should be implemented

“No backend yet” is **not** a reason to fake UI.

---

## 4. Orphan Prevention Rule

Any new page, component, or feature must:

* Be reachable via:

  * Navigation
  * CTA
  * Redirect
* Be backed by:

  * Real data
  * Real state
  * Real persistence

Forbidden:

* “Coming soon” pages
* Dead-end routes
* UI with no entry point

---

## 5. Minimal Diff Discipline

* Touch the smallest possible surface.
* Do not reformat unrelated files.
* Do not rename variables unless necessary.
* Never undo or rewrite user changes.

Every diff should be reviewable in under 5 minutes.

---

## 6. Plan-First Execution (Unless Trivial)

For non-trivial work:

1. Propose a 2–4 step plan.
2. Wait for confirmation if scope is unclear.
3. Execute step-by-step.
4. Update the plan after each major step.

Trivial fixes may skip planning.

---

## 7. Onboarding Guardrails (merchant-admin)

### Canonical onboarding order

welcome
→ identity
→ business
→ visuals/branding
→ finance
→ logistics
→ inventory (industry-dependent)
→ kyc
→ review
→ complete

Rules:

* Enforce industry-based required vs skippable steps using `INDUSTRY_CONFIG`.
* Preserve save/resume:

  * `currentStep`
  * `requiredSteps`
  * `skippedSteps`
* Never block dashboard access unless legally required.

### Completion rules

* BVN + bank name must match.
* CAC required for registered businesses.
* KYC:

  * Required for registered businesses
  * Pending allowed for individuals.

---

## 8. Payments & KYC Rules

* Use real Paystack integrations only.
* Normalize and strictly compare names.
* Status transitions:

  * PENDING → VERIFIED only via ops-console.
* UI must reflect backend truth (no visual-only toggles).

---

## 9. Templates & Storefront Rules

* Apply templates via registry IDs only.
* Enforce plan tiers.
* Publishing must:

  * Write to `storefrontDraft`
  * Call `/api/storefront/publish`
  * Fall back safely on failure
* No visual-only “publish success”.

---

## 10. Ops Console Authority

* Ops actions must update:

  * Onboarding status
  * Wallet flags
  * Store flags
* Never allow UI to override ops decisions.

---

## 11. Execution Checklist (MANDATORY OUTPUT)

At the end of any task, report:

* ✅ What changed (files + purpose)
* 🧩 What was fixed
* ⛔ What is blocked (and why)
* ⚠️ Risks or follow-ups
* ➡️ Next recommended step

Keep reports concise and factual.

---

## 12. Communication Style

* Be direct, calm, and technical.
* Lead with outcomes, not explanations.
* Reference files as `path[:line]`.
* No large code dumps unless asked.

If blocked, say so clearly and propose the **minimal unblock**.

---

**This workflow overrides default behavior.
Follow it strictly.**
