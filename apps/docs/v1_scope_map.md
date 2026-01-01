# V1 Scope Map: Screen → Capabilities

This document serves as the canonical map for the V1 release of the Vayva platform. It links user screens to backend commands, entities, and permissions.

## A. Authentication & Onboarding

| Screen                | Goal                         | Commands                                | Entities        | Permissions         |
| :-------------------- | :--------------------------- | :-------------------------------------- | :-------------- | :------------------ |
| `/auth/login`         | Securely authenticate user   | `auth.login`, `auth.2fa.verify`         | `User`          | Public              |
| `/auth/signup`        | Create new merchant account  | `auth.signup`                           | `User`, `Store` | Public              |
| `/onboarding/profile` | Complete user profile        | `user.updateProfile`                    | `User`          | `auth.loggedIn`     |
| `/onboarding/store`   | Set up initial store details | `store.update`, `store.settings.update` | `Store`         | `store.manage`      |
| `/onboarding/verify`  | Submit KYC documents         | `compliance.kyc.submit`                 | `ComplianceDoc` | `compliance.manage` |

## B. Merchant Dashboard (Overview)

| Screen                 | Goal                             | Commands                                       | Entities          | Permissions      |
| :--------------------- | :------------------------------- | :--------------------------------------------- | :---------------- | :--------------- |
| `/admin`               | View business health at a glance | `analytics.getOverview`                        | `AnalyticsMetric` | `analytics.view` |
| `/admin/notifications` | View system alerts               | `notifications.list`, `notifications.markRead` | `Notification`    | `auth.loggedIn`  |

## C. Products & Inventory

| Screen                      | Goal                       | Commands                                                  | Entities             | Permissions                        |
| :-------------------------- | :------------------------- | :-------------------------------------------------------- | :------------------- | :--------------------------------- |
| `/admin/products`           | extensive list of products | `products.list`, `products.delete`, `products.bulkStatus` | `Product`            | `products.view`, `products.manage` |
| `/admin/products/new`       | Create a new product       | `products.create`                                         | `Product`, `Variant` | `products.create`                  |
| `/admin/products/[id]`      | Edit product details       | `products.update`, `products.media.upload`                | `Product`            | `products.update`                  |
| `/admin/products/inventory` | Adjust stock levels        | `inventory.adjust`, `inventory.transfer`                  | `InventoryItem`      | `inventory.manage`                 |
| `/admin/collections`        | Manage product grouping    | `collections.create`, `collections.update`                | `Collection`         | `products.manage`                  |

## D. Orders & Fulfillment

| Screen                        | Goal                     | Commands                                 | Entities             | Permissions       |
| :---------------------------- | :----------------------- | :--------------------------------------- | :------------------- | :---------------- |
| `/admin/orders`               | Manage incoming orders   | `orders.list`, `orders.export`           | `Order`              | `orders.view`     |
| `/admin/orders/[id]`          | Process a specific order | `orders.updateStatus`, `orders.note.add` | `Order`, `OrderNote` | `orders.manage`   |
| `/admin/orders/[id]/delivery` | Schedule local delivery  | `delivery.task.create`                   | `DeliveryTask`       | `delivery.manage` |
| `/admin/orders/[id]/refund`   | Initiate refund flow     | `refund.request`                         | `RefundRequest`      | `refund.request`  |

## E. Finance & Payouts

| Screen                        | Goal                   | Commands                          | Entities             | Permissions        |
| :---------------------------- | :--------------------- | :-------------------------------- | :------------------- | :----------------- |
| `/admin/finance/transactions` | View payment history   | `payments.list`                   | `PaymentTransaction` | `finance.view`     |
| `/admin/finance/payouts`      | Manage withdrawals     | `payouts.list`, `payouts.request` | `Payout`             | `finance.payout`   |
| `/admin/finance/settings`     | Configure bank details | `finance.bankInv.update`          | `BankAccount`        | `finance.settings` |

## F. Customers (CRM)

| Screen                  | Goal                  | Commands            | Entities            | Permissions      |
| :---------------------- | :-------------------- | :------------------ | :------------------ | :--------------- |
| `/admin/customers`      | View customer base    | `customers.list`    | `Customer`          | `customers.view` |
| `/admin/customers/[id]` | View customer history | `customers.details` | `Customer`, `Order` | `customers.view` |

## G. Storefront Builder

| Screen                 | Goal                     | Commands               | Entities      | Permissions      |
| :--------------------- | :----------------------- | :--------------------- | :------------ | :--------------- |
| `/admin/store/themes`  | Select visual theme      | `store.theme.select`   | `StoreTheme`  | `store.design`   |
| `/admin/store/editor`  | Customize layout/content | `store.layout.update`  | `StoreLayout` | `store.design`   |
| `/admin/store/domains` | Connect custom domain    | `store.domain.connect` | `StoreDomain` | `store.settings` |

## H. Marketplace

| Screen                          | Goal                          | Commands                     | Entities             | Permissions           |
| :------------------------------ | :---------------------------- | :--------------------------- | :------------------- | :-------------------- |
| `/admin/marketplace/opt-in`     | List products on Vayva Market | `marketplace.listing.create` | `MarketplaceListing` | `marketplace.manage`  |
| `/admin/marketplace/promotions` | Boost product visibility      | `marketplace.boost.create`   | `Promotion`          | `marketplace.promote` |

## I. WhatsApp AI

| Screen                        | Goal                   | Commands               | Entities             | Permissions   |
| :---------------------------- | :--------------------- | :--------------------- | :------------------- | :------------ |
| `/admin/whatsapp/settings`    | Configure AI assistant | `wa.settings.update`   | `WhatsAppConfig`     | `wa.settings` |
| `/admin/whatsapp/automations` | Set auto-reply rules   | `wa.automation.update` | `WhatsAppAutomation` | `wa.settings` |

## J. Settings

| Screen                    | Goal                  | Commands                            | Entities       | Permissions      |
| :------------------------ | :-------------------- | :---------------------------------- | :------------- | :--------------- |
| `/admin/settings/general` | Store info & currency | `store.settings.update`             | `Store`        | `store.settings` |
| `/admin/settings/staff`   | Manage team access    | `staff.invite`, `staff.role.update` | `User`, `Role` | `staff.manage`   |
| `/admin/settings/billing` | Manage subscription   | `billing.subscription.update`       | `Subscription` | `billing.manage` |

## K. Operations (Internal)

| Screen          | Goal                       | Commands                              | Entities    | Permissions   |
| :-------------- | :------------------------- | :------------------------------------ | :---------- | :------------ |
| `/ops`          | Internal admin dashboard   | `ops.stats.view`                      | `OpsMetric` | `ops.view`    |
| `/ops/users`    | Manage merchant users      | `ops.user.suspend`, `ops.user.verify` | `User`      | `ops.manage`  |
| `/ops/disputes` | Resolve transaction issues | `ops.dispute.resolve`                 | `Dispute`   | `ops.dispute` |
