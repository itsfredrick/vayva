# Approval Gates & Rules

This document defines the "Safety Rails" for sensitive actions within Vayva. Actions falling under these categories cannot be executed immediately by standard users and require a secondary confirmation step.

## Core Principles

1. **Four-Eyes Principle**: Sensitive financial actions (refunds) always require a second pair of eyes or high-level authorization.
2. **Time-Bound**: Approvals are not infinite. They expire if not acted upon to prevent stale state.
3. **Escalation**: Actions can be auto-approved if they fall below certain risk thresholds (e.g., small discounts), otherwise they escalate.

## Approval Types

### 1. Refund Requests (`REFUND`)

- **Trigger**: Staff initiates a refund for an order.
- **Gate**: **ALWAYS** requires approval.
- **Approvers**: `OWNER`, `ADMIN`
- **Expiry**: 24 Hours
- **Auto-Approve**: None.

### 2. Manual Discounts (`DISCOUNT`)

- **Trigger**: Staff applies a custom discount at checkout or order creation.
- **Gate**: Required if discount > ₦5,000 (Configurable).
- **Approvers**: `OWNER`, `ADMIN`
- **Expiry**: 24 Hours

### 3. Delivery Schedule Verification (`DELIVERY_SCHEDULE`)

- **Trigger**: Logistics partner requests a slot change or high-cost delivery route.
- **Gate**: Required for verification.
- **Approvers**: `OWNER`, `ADMIN`, `OPS_ADMIN`
- **Expiry**: 4 Hours (Urgent)

### 4. Status Override (`STATUS_CHANGE`)

- **Trigger**: System flagged transaction needs manual state force.
- **Gate**: Ops intervention.
- **Approvers**: `OPS_ADMIN`
- **Expiry**: 48 Hours

## Workflow

1. User requests action -> System creates `Approval` entity with status `PENDING`.
2. UI blocks the final execution and shows "Pending Approval".
3. Notification sent to eligible approvers.
4. Approver views request -> Clicks "Approve" or "Reject".
5. **If Approved**: System executes the deferred command.
6. **If Rejected**: System marks request as `REJECTED`, notifies requester.
7. **If Expired**: System marks as `EXPIRED`, action is cancelled.
