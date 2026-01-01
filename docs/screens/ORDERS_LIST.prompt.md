# 1) Orders list (filters, search, statuses)

## STABILITY MODE (APPLY — DO NOT DEVIATE)

- Page: `/admin/orders`
- Shell: `AdminShell` (Dark mode only)

## Layout

- Title: **Orders**
- **Filters Panel**: Search (debounced), Status Chips, Date Range, Channel (v1), Export.
- **Table**: Checkbox, Order #, Customer, Items, Total, Payment (chip), Fulfillment (chip), Created, Action.
- **Bulk Actions**: Appears when selection > 0. (Process, Delivery Task, Export, Archive).

## States

- Loading: Skeletons.
- Empty: "No orders yet" + CTA.
