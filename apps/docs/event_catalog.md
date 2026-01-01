# Event Catalog

This document serves as the single source of truth for all system and analytics events in Vayva.

## Event Categories

- **Auth**: User authentication and session management.
- **Commerce**: Core e-commerce actions (Orders, Products).
- **Finance**: Payments, Refunds, Payouts.
- **Ops**: Internal operations and logic.
- **System**: Errors and system-level alerts.

## Events List

### Auth

| Event Name         | Description                          | Payload                               |
| :----------------- | :----------------------------------- | :------------------------------------ |
| \`user.signed_up\` | Triggered when a new user registers. | \`{ userId: string, email: string }\` |
| \`user.logged_in\` | Triggered on successful login.       | \`{ userId: string }\`                |

### Commerce

| Event Name          | Description                                 | Payload                                        |
| :------------------ | :------------------------------------------ | :--------------------------------------------- |
| \`order.created\`   | Triggered when a new order is placed.       | \`{ orderId: string, total: number }\`         |
| \`order.paid\`      | Triggered when payment is confirmed.        | \`{ orderId: string, transactionId: string }\` |
| \`order.fulfilled\` | Triggered when order delivery is completed. | \`{ orderId: string }\`                        |
| \`order.cancelled\` | Triggered when order is cancelled.          | \`{ orderId: string, reason: string }\`        |
| \`product.created\` | Triggered when a new product is added.      | \`{ productId: string, storeId: string }\`     |

### Finance

| Event Name           | Description                               | Payload                                       |
| :------------------- | :---------------------------------------- | :-------------------------------------------- |
| \`payment.received\` | Triggered when money hits the wallet.     | \`{ transactionId: string, amount: number }\` |
| \`payout.initiated\` | Triggered when a withdrawal is requested. | \`{ payoutId: string, amount: number }\`      |

### System

| Event Name         | Description             | Payload                                               |
| :----------------- | :---------------------- | :---------------------------------------------------- |
| \`error.occurred\` | Critical system errors. | \`{ code: string, message: string, stack?: string }\` |
