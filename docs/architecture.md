# Vayva Platform Architecture

## System Overview

Vayva is designed as a modular, high-performance monorepo facilitating a multi-tenant commerce engine. The system is composed of distinct applications and services that communicate via standardized APIs and strictly typed contracts.

### Core Components

1.  **Web Applications (`apps/`)**:
    - **Merchant Dashboard**: Next.js App Router application for merchants to manage their business.
    - **Ops Console**: Internal administrative tool for platform oversight.
    - **Storefront**: Performance-optimized public facing store for customers.
    - **Mobile**: React Native application for merchants on the go.

2.  **Workers (`apps/worker`)**:
    - **Worker Node**: Background processing engine handling asynchronous tasks.
    - **Responsibilities**: Email delivery, WhatsApp message processing, Webhook ingestion, Order syncing.

3.  **Services (`services/`)**:
    - **Domain-specific backend logic** isolated by context.
    - **Auth**: Authentication & Identity management.
    - **Ledger**: Double-entry financial recording system.
    - **Orders**: Order lifecycle management.
    - **WhatsApp**: Connector for WhatsApp Business API interactions.

4.  **Data Layer**:
    - **PostgreSQL**: Primary transactional database.
    - **Redis**: Caching and Job Queue (BullMQ) storage.

## Architecture Diagram

```mermaid
graph TD
    subgraph Clients
        MD[Merchant Dashboard]
        OC[Ops Console]
        SF[Storefront]
        MA[Mobile App]
    end

    subgraph "API Layer (Next.js / Services)"
        API[Unified API Gateway]
    end

    subgraph "Core Services"
        Auth[Identity Service]
        Ledger[Ledger Service]
        Orders[Inbound Orders]
        WAS[WhatsApp Service]
    end

    subgraph "Async Processing"
        Worker[Worker Node]
        Queue[Redis BullMQ]
    end

    subgraph Storage
        DB[(PostgreSQL)]
        Cache[(Redis)]
    end

    subgraph External
        Paystack[Paystack Payment]
        Resend[Resend Email]
        Meta[WhatsApp Cloud API]
    end

    Clients --> API
    API --> Auth
    API --> Ledger
    API --> Orders
    API --> WAS

    Orders --> DB
    Ledger --> DB
    Auth --> DB
    WAS --> DB

    Orders --> Queue
    WAS --> Queue

    Queue --> Worker

    Worker --> Resend
    Worker --> Meta
    Worker --> DB

    API -.-> Cache
```

## Service Contracts

The system relies on strict contracts for inter-service communication and background processing.

### Worker Node

**Input/Output Model:**
All jobs are pushed to Redis queues. The worker polls these queues and executes the corresponding job processor.

| Queue Name         | Payload Type      | Description                                        |
| :----------------- | :---------------- | :------------------------------------------------- |
| `email`            | `SendEmailJob`    | Transactional emails (Welcome, Order Confirm)      |
| `whatsapp-inbound` | `WhatsAppMessage` | Raw webhooks from Meta to be processed             |
| `webhook-delivery` | `WebhookPayload`  | Events to be sent to merchant-configured endpoints |
| `orders-sync`      | `OrderSyncJob`    | Syncing orders between cache and primary DB        |

**Message Processing Pipeline (WhatsApp):**

1.  **Ingestion**: Webhook received -> Pushed to `whatsapp-inbound` queue.
2.  **Normalization**: Worker validates signature -> Normalizes to internal `Message` format.
3.  **Routing**: Agent Router determines intent (Sales vs Support) -> Dispatches to AI or Support Inbox.
4.  **Response**: AI generates response -> Pushed to `whatsapp-outbound` queue -> Sent to Meta.

**Delivery Scheduling Flow:**

1.  Order placed -> `order.created` event fired.
2.  Logistics Service evaluates routing rules.
3.  Delivery Job scheduled with 3rd party provider (e.g., Kwik).
4.  Worker executes booking -> Updates Order Status.

### Webhook Boundaries

- **Inbound**: All external webhooks (Paystack, Meta) are verified at the Edge and instantly pushed to a Queue to ensure 200 OK response times. Processing happens asynchronously.
- **Outbound**: Retries are handled by BullMQ with exponential backoff.

## Data Ownership

Services own specific database tables to maintain domain boundaries.

| Service / Domain    | Owned Tables                                           | Access Type                                                            |
| :------------------ | :----------------------------------------------------- | :--------------------------------------------------------------------- |
| **Auth / Identity** | `User`, `Account`, `Session`, `VerificationToken`      | **Write**: Exclusive <br> **Read**: Shared (via libraries)             |
| **Merchant**        | `Merchant`, `Store`, `TeamMember`, `BusinessProfile`   | **Write**: Merchant Service <br> **Read**: Shared                      |
| **Catalog**         | `Product`, `Variant`, `Collection`, `Inventory`        | **Write**: Catalog Service <br> **Read**: Storefront / Orders          |
| **Orders**          | `Order`, `OrderItem`, `Fulfillment`, `ShippingAddress` | **Write**: Order Service <br> **Read**: Shared                         |
| **Ledger**          | `Transaction`, `Wallet`, `Payout`, `AuditLog`          | **Write**: Ledger Service (Append-Only) <br> **Read**: Admin / Payouts |
| **Communication**   | `EmailLog`, `WhatsAppMessage`, `Conversation`          | **Write**: Worker / Comm Service <br> **Read**: Admin                  |

**Rules:**

1.  Services should not write to tables they do not own.
2.  Cross-domain data requirements should be handled via Service APIs or shared schema libraries with strict ACL.
