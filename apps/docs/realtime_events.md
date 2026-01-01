# Realtime Events Contract (v1)

These events are broadcasted via WebSocket (Socket.io) to the frontend or sent as Push Notifications to mobile apps.

## Naming Convention

`{entity}.{action}` (e.g. `order.created`)

## Core Events

### Orders

- `order.created`
  - Payload: `{ orderId: string, total: number, currency: string }`
  - Trigger: New order placed on Storefront.
- `order.status.updated`
  - Payload: `{ orderId: string, oldStatus: string, newStatus: string }`

### Payments

- `payment.verified`
  - Payload: `{ paymentId: string, orderId: string, amount: number }`
  - Trigger: Paystack webhook received "charge.success".

### Approvals (Ops)

- `approval.requested`
  - Payload: `{ type: string, summary: string, requestId: string }`
  - Trigger: High-risk action (refund > limit).
- `approval.decided`
  - Payload: `{ requestId: string, decision: "APPROVED" | "REJECTED" }`

### WhatsApp

- `wa.message.received`
  - Payload: `{ conversationId: string, content: string, sender: string }`

### Delivery

- `delivery.task.updated`
  - Payload: `{ taskId: string, status: string, driverParams: object }`

## Implementation

- Backend publishes to Redis Channel `events`.
- Socket Service subscribes and forwards to room `store:{storeId}`.
