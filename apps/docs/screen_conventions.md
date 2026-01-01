# Screen Construction & UI Conventions

This document outlines the strict conventions for building UI screens in Vayva. Adherence is mandatory to maintain the "Apple-level" quality bar and prevent UI drift.

## 1. Shared UI is the Source of Truth

- **Never** build a primitive component (Button, Input, Card, Modal, Badge) inside an app.
- Always import from `@vayva/ui`.
- If a component is missing, add it to `@vayva/ui` first, then import it.

## 2. Navigation Shells

- Every page **must** be wrapped in a standardized shell layout.
- **Merchant Admin**: Use `AppShell`.
- **Ops Console**: Use `OpsShell`.
- **Storefront**: Use `StorefrontShell`.

## 3. Tailwind Usage

- **Prohibited**: Unstructured, ad-hoc colors (e.g., `bg-[#f0f0f0]`, `text-blue-500`) are banned in app code.
- **Required**: Use semantic tokens from `@vayva/theme` or CSS variables (e.g., `bg-background`, `text-primary`).
- **Standard Spacing**: Use standard tailwind spacing (p-4, m-6) divisible by 4.

## 4. Iconography

- Use the `Icon` component from `@vayva/ui`.
- Do not import `lucide-react` directly in apps.

## 5. File Structure

- Components belonging to a specific feature should live in `components/[feature]/`.
- Generic app-specific components (that are NOT primitives) live in `components/shared/`.
