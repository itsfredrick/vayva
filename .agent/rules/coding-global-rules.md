---
trigger: always_on
---

# ANTIGRAVITY — CODING GLOBAL RULES (VAYVA)

## PURPOSE

These rules define **how Antigravity must write code** for Vayva.
They exist to prevent:

* architectural drift
* hidden logic
* unsafe payments
* untraceable state changes
* “it works but we don’t know how” systems

Violating these rules = **failed build**.

---

## 1. ARCHITECTURE RULES (NON-NEGOTIABLE)

### 1.1 Single Source of Truth

* Backend is the **only authority** for:

  * order states
  * payments
  * delivery status
  * escrow state
* Frontend (web/mobile) is **purely declarative**
* NEVER compute business rules on the client

---

### 1.2 Domain Separation (STRICT)

Code must be separated into domains:

* `buyers`
* `merchants`
* `china_imports`
* `orders`
* `payments`
* `delivery`
* `ops_console`
* `auth`
* `notifications`

❌ No cross-domain logic leaks
❌ No “shared utils” that contain business rules

---

### 1.3 Parent–Child Order Model (MANDATORY)

* Every checkout creates:

  * 1 Parent Order
  * ≥1 Child Orders
* China Import orders are **NOT** child orders of local checkout
* Parent orders NEVER contain fulfillment logic

---

## 2. STATE MANAGEMENT RULES

### 2.1 Explicit State Machines Only

* Every entity with a lifecycle MUST have:

  * enumerated states
  * allowed transitions
  * transition guards
* No free-form status strings
* No skipping states

Example (Import Order):

```
CREATED → DEPOSIT_PENDING → DEPOSIT_PAID → SUPPLIER_CONFIRMED → ...
```

---

### 2.2 State Changes = Events

Every state change MUST:

* go through a service layer
* emit an event
* be logged with:

  * actor
  * timestamp
  * previous state
  * next state
  * reason (if manual)

---

## 3. PAYMENTS & LEDGER RULES (ABSOLUTE)

### 3.1 Ledger Is Sacred

* Ledger tables are **append-only**
* NO updates
* NO deletes
* Refunds are **reversal entries**
* Balances are derived, never stored

---

### 3.2 No Money Without Ledger

❌ No wallet balance change
❌ No escrow release
❌ No merchant credit

…without a corresponding ledger entry.

If ledger ≠ UI → **ledger wins**.

---

### 3.3 Escrow Is Logical but Enforced

* Escrow does NOT mean separate bank account
* Escrow MUST:

  * block release until condition met
  * be enforced in code
  * be auditable

---

## 4. ROLE & PERMISSION RULES

### 4.1 Zero Trust by Default

* Every API endpoint:

  * requires authentication
  * validates role
* No implicit permissions

---

### 4.2 Role Capabilities (STRICT)

* Buyer:

  * cannot mutate orders after payment
* Merchant:

  * cannot release escrow
  * cannot edit delivery fees post-checkout
* Ops:

  * can override, BUT must provide reason

Overrides MUST be logged.

---

## 5. OPS CONSOLE RULES

### 5.1 Ops Is Not a Shortcut

* Ops Console actions use **the same services**
* No “admin bypass” logic
* If Ops can do it, the system must still:

  * validate
  * log
  * enforce rules

---

### 5.2 Manual Actions Are First-Class

Every manual Ops action MUST:

* require confirmation
* require reason
* create an audit record

---

## 6. DATA INTEGRITY RULES

### 6.1 No Silent Failures

* All failures must:

  * return explicit errors
  * be logged
* No `try/catch` that swallows errors

---

### 6.2 Idempotency Everywhere

* Payments
* Webhooks
* Order transitions
* Agent communications

Duplicate requests MUST be safe.

---

## 7. EXTERNAL INTEGRATION RULES (CHINA AGENTS)

### 7.1 Normalize Everything

* Agent responses (email, WhatsApp, API) MUST be:

  * transformed into structured records
  * linked to originating request

❌ No “free text” decisions in code paths

---

### 7.2 Never Trust External Prices

* All prices from agents are:

  * proposals
  * not truth
* Final prices must be confirmed + stored before payment

---

## 8. FRONTEND & MOBILE RULES

### 8.1 No Business Logic on Client

Frontend MAY:

* format data
* handle UI state
  Frontend MUST NOT:
* calculate prices
* infer delivery
* guess order state

---

### 8.2 Explicit Loading & Error States

Every async action MUST have:

* loading state
* success state
* failure state

No silent waiting.

---

## 9. TESTING & VERIFICATION RULES

### 9.1 Mandatory Test Types

Antigravity MUST write:

* unit tests (domain logic)
* integration tests (orders + payments)
* state transition tests
* ledger consistency tests

---

### 9.2 Acceptance Tests Must Map to Spec

Each checklist item in the master prompt MUST have:

* a test
* or a verifiable demo step

No untestable logic allowed.

---

## 10. VERSIONING & DEPLOYMENT RULES

### 10.1 No Breaking Changes Without Migration

* Schema changes require migrations
* State enum changes require migration scripts

---

### 10.2 Feature Flags for Risky Paths

* China Import
* Escrow release
* Delivery consolidation

All must be flag-controlled.

---

## 11. CODE REVIEW BLOCKERS (AUTO-FAIL)

The build FAILS if:

* money moves without ledger
* states are changed directly
* Ops bypasses core logic
* frontend calculates totals
* escrow rules are duplicated
* logic is duplicated across services

---

## FINAL RULE (MOST IMPORTANT)

If Antigravity cannot **explain, trace, and replay**:

* any order
* any payment
* any escrow release

…then the system is **NOT production-ready**.

END OF CODING GLOBAL RULES
