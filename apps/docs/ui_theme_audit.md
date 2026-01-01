# Theme Compliance Checklist

## Token Usage Rules

- [x] **Colors**: All colors must use tokens from `packages/theme` or CSS variables (`bg-primary`, `bg-white/10`).
  - **Forbidden**: Hardcoded hex values like `#46EC13` or `#142210` in app components.
- [x] **Typography**: Font family must be `Manrope`.
- [x] **Radius**: Use `rounded-lg`, `rounded-xl` consistent with design tokens.
- [x] **Spacing**: Use standard Tailwind spacing (4, 6, 8, 12).

## Component Usage Rules

- [x] **Layout**: All pages must be wrapped in `AppShell` (Merchant), `StorefrontShell` (Storefront), or `OpsShell` (Ops).
- [x] **Surfaces**: Use `GlassPanel` for cards/containers.
- [x] **Interactions**: Use `Button` from `@vayva/ui` for all clickables (inherits motion).
- [x] **Status**: Use `StatusChip` for all status indicators.

## Forbidden Patterns

- `bg-[#hex]` (Exception: one-off gradients if not in theme)
- `font-inter` (in Merchant Admin)
- Page-specific Sidebar/Header implementations.

## Audit Results

- **Merchant Admin**: PASS. Global styles applied. AppShell updated.
- **Storefront**: PASS. Manrope enforced.
- **UI Package**: PASS. Motion integrated.
