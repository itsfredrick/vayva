# Domain Enums & Statuses

This document defines the set of allowed values for system statuses, roles, and types. These act as the "source of truth" for the application logic.

## Roles

| Role        | Description                                                                 |
| :---------- | :-------------------------------------------------------------------------- |
| `OWNER`     | Primary account holder. Full access to everything including bank details.   |
| `ADMIN`     | High-level manager. Can manage products, orders, and staff. No bank access. |
| `STAFF`     | Standard employee. Can fulfill orders and view products. Restricted access. |
| `OPS_ADMIN` | Vayva internal super-admin. Can manage disputes and suspend accounts.       |
| `OPS_AGENT` | Vayva internal support agent. Read-only access for support.                 |

## Order Statuses

### Payment Status

| Status     | Description                                    |
| :--------- | :--------------------------------------------- |
| `PENDING`  | Payment initiated but not yet confirmed.       |
| `VERIFIED` | Payment successfully captured and verified.    |
| `FAILED`   | Payment attempt failed or was declined.        |
| `REFUNDED` | Full amount has been returned to the customer. |
| `DISPUTED` | Customer has raised a chargeback or dispute.   |

### Fulfillment Status

| Status             | Description                                |
| :----------------- | :----------------------------------------- |
| `PROCESSING`       | Order is being packed or prepared.         |
| `OUT_FOR_DELIVERY` | Handed over to logistics partner or rider. |
| `DELIVERED`        | Successfully received by the customer.     |
| `CANCELLED`        | Order was cancelled before fulfillment.    |

## Approvals

### Types

| Type                | Description                                                    |
| :------------------ | :------------------------------------------------------------- |
| `DELIVERY_SCHEDULE` | Confirming a complex delivery slot.                            |
| `DISCOUNT`          | Applying a manual discount above a certain threshold.          |
| `REFUND`            | Processing a refund request.                                   |
| `STATUS_CHANGE`     | Manually forcing a status change (e.g., verifying a transfer). |

### Status

| Status     | Description                             |
| :--------- | :-------------------------------------- |
| `PENDING`  | Awaiting decision.                      |
| `APPROVED` | Action authorized.                      |
| `REJECTED` | Action denied.                          |
| `EXPIRED`  | Time limit for approval (24h) exceeded. |

## Delivery

| Status        | Description                                           |
| :------------ | :---------------------------------------------------- |
| `SCHEDULED`   | Task created for a future time.                       |
| `IN_PROGRESS` | Rider is en route.                                    |
| `DELIVERED`   | Item handed to customer.                              |
| `FAILED`      | Delivery attempt failed (e.g., customer unavailable). |
| `CANCELLED`   | Task cancelled by merchant or ops.                    |

## Marketplace Listing

| Status           | Description                                     |
| :--------------- | :---------------------------------------------- |
| `UNLISTED`       | Product is only on storefront, not marketplace. |
| `LISTED`         | Live and visible on Vayva Market.               |
| `PENDING_REVIEW` | Submitted for moderation.                       |
| `REJECTED`       | Failed moderation checks.                       |

## Support Conversations

| Status      | Description                      |
| :---------- | :------------------------------- |
| `OPEN`      | Active conversation.             |
| `ESCALATED` | Flagged for human/ops attention. |
| `RESOLVED`  | Issue closed.                    |

## Channels

| Channel       | Description                             |
| :------------ | :-------------------------------------- |
| `STOREFRONT`  | Sales via merchant's custom website.    |
| `MARKETPLACE` | Sales via Vayva global marketplace app. |
| `WHATSAPP_AI` | Sales via automated WhatsApp chat.      |

## Notifications

| Type       | Description                            |
| :--------- | :------------------------------------- |
| `ORDER`    | New orders or status updates.          |
| `APPROVAL` | Requests requiring merchant attention. |
| `PAYMENT`  | Successful payments or failures.       |
| `PAYOUT`   | Withdrawal updates.                    |
| `SYSTEM`   | Platform announcements or maintenance. |
