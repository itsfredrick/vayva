# 2) Customer profile (orders, notes)

## STABILITY MODE (APPLY — DO NOT DEVIATE)

- Page: `/admin/customers/[id]`
- Shell: `AdminShell`

## Layout (2-column)

- **Header**: Customer Name, "Since [Date]", Status Chips.
- **Left**:
  - Overview: Contact info, Address, Quick Actions (WhatsApp, Draft Order).
  - Order History: Table of orders (ID, Total, Status).
  - Insights: Most bought, Avg Order Value.
- **Right**:
  - Notes: List of internal notes + Add Button (opens modal).
  - Communication: Last WhatsApp message snippet.

## Interaction

- **Add Note**: Opens Modal (see #3).
