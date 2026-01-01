# API Inventory & Auth Scopes

All endpoints require `Bearer` token authentication via the `Authorization` header.
Role: `MERCHANT_ADMIN` or `MERCHANT_FINANCE`.

## Wallet Domain

| Method | Endpoint                              | Description                                                | Scope |
| :----- | :------------------------------------ | :--------------------------------------------------------- | :---- |
| `GET`  | `/api/wallet/balance`                 | Get current wallet balances (Available, Pending, Blocked). | Read  |
| `GET`  | `/api/wallet/transactions`            | List ledger history with filters.                          | Read  |
| `GET`  | `/api/wallet/payouts`                 | List payout history and status.                            | Read  |
| `GET`  | `/api/wallet/withdraw/eligibility`    | Check KYC and Balance blocking rules.                      | Read  |
| `POST` | `/api/wallet/withdraw/quote`          | Calculate fees and estimated arrival.                      | Read  |
| `POST` | `/api/wallet/withdraw`                | Execute a withdrawal request.                              | Write |
| `GET`  | `/api/wallet/payout-accounts`         | List saved bank accounts.                                  | Read  |
| `POST` | `/api/wallet/payout-accounts`         | Add new bank account (with resolution).                    | Write |
| `POST` | `/api/wallet/payout-accounts/resolve` | Resolve account name via Bank API.                         | Read  |

## Invoicing Domain

| Method | Endpoint                 | Description                                  | Scope |
| :----- | :----------------------- | :------------------------------------------- | :---- |
| `GET`  | `/api/invoices`          | List invoices (Paid, Unpaid, Overdue).       | Read  |
| `POST` | `/api/invoices`          | Generate a new invoice.                      | Write |
| `GET`  | `/api/invoices/:id`      | Get single invoice details.                  | Read  |
| `POST` | `/api/invoices/:id/send` | Get deep-link to share invoice via WhatsApp. | Share |
| `GET`  | `/api/invoices/:id/pdf`  | Download PDF version (Stream).               | Read  |
