# Youverify Link Update

Per user request, the Youverify trust indicator on the marketing landing page has been updated to be clickable.

## Changes
*   **File**: `src/app/(marketing)/page.tsx`
*   **Modification**: Wrapped the Youverify logo and "Identity Verified" text in an anchor tag (`<a>`).
*   **Destination**: `https://youverify.co` (opens in new tab).
*   **Effects**: Added `group` and `group-hover` classes to ensure simultaneous hover effects for both the logo (grayscale removal) and text (darkening).

## UI Structure
The trust indicators strip now contains:
1.  **Paystack** (Static)
2.  **Youverify** (Clickable -> youverify.co)
3.  **123design** (Clickable -> 123.design)
4.  **No card required** (Static)
