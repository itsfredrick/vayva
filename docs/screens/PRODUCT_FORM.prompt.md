# 3) Add product / 4) Edit product

## STABILITY MODE (APPLY — DO NOT DEVIATE)

- Page: `/admin/products/new` & `/admin/products/[id]`
- Shell: `AdminShell`

## Layout (Two-column)

- **Left**:
  - Media (Dropzone + Grid).
  - Basic Info (Name, Rich Text Desc).
  - Organization (Type, Brand, Tags).
- **Right**:
  - Status (Active/Draft).
  - Pricing (Price, Cost, Margin).
  - Inventory (SKU, Tracking toggle, Qty, Low stock).
  - Collections (Multi-select).
- **Variant Toggle**: "This product has multiple options".
- **Sticky Bar**: Discard, Save (Primary).

## Notes

- Reuse same form component for Add and Edit.
