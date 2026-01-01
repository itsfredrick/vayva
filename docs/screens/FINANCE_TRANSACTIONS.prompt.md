# 1) Payments overview (transactions)

## STABILITY MODE (APPLY — DO NOT DEVIATE)

- Page: `/admin/finance/transactions` (Mapping "Payments" to Finance section for better URL structure, or stick to spec `/admin/payments`? Spec says "Payments overview", implies `/admin/finance/transactions` or `/admin/payments`. Let's use `/admin/finance/transactions` as a sub-route).

## Layout

- **KPI Row**: Total Received, Successful, Failed, Pending Refunds.
- **Toolbar**: Search (pill), Filters (Status, Channel, Provider, Date), Export.
- **Table**: ID, Order Link, Customer, Amount, Status, Provider, Date, Action.
