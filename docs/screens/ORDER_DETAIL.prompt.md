# 2) Order detail (desktop/mobile)

## STABILITY MODE (APPLY — DO NOT DEVIATE)

- Page: `/admin/orders/[id]`
- Shell: `AdminShell`

## Layout (Desktop 2-col)

- **Header**: Title "Order VV-1024", Actions (Update status, Create delivery task, More).
- **Left**:
  - Summary (Status, Customer, Source).
  - Items (List with thumbnails).
  - Delivery (Address, Method, Fee, Task Status).
  - Customer Messages (optional).
- **Right**:
  - Payment (Verified/Pending/Failed, Provider, Breakdown).
  - Timeline (Embedded preview).
  - Risk/Notes.

## Layout (Mobile)

- Sticky Top Bar.
- Sticky Bottom Action Bar.
- Stacked Cards.
