# Vayva PWA: Current User & Data Flow

This document outlines the end-to-end flow of the Vayva application as it stands now, focusing on the "App-Like" user journey and the underlying data logic.

---

## 1. App Launch (The "Splash" Phase)

**Entry Point**: User launches the app (PWA) or visits the site.

1.  **PWA Context**: App checks authentication status (`checkAppLaunchStatus`).
2.  **Routing Logic**:
    *   **Unauthenticated**: Redirect -> `/signin` (Login Page).
    *   **Authenticated**:
        *   **Setup Complete**: Redirect -> `/admin/dashboard` (Immediate Dashboard Access).
        *   **Setup Incomplete**: Redirect -> `/onboarding` (Resume Setup).

*Note: The system intelligently distinguishes between established merchants (Scenario B) and new sign-ups (Scenario A).*

---

## 2. Authentication & Onboarding

**Scenario A: New User (Sign Up)**
1.  **Sign Up**: User creates an account.
2.  **Onboarding Flow**:
    *   Redirected specifically to `/onboarding`.
    *   Completes Business Basics, Templates, etc.
    *   **Completion**: Flag saved to DB -> User moved to Dashboard.

**Scenario B: Existing User (Log In)**
1.  **Login**: User enters credentials at `/signin`.
2.  **Dashboard Access**:
    *   System detects existing account.
    *   **Direct Access**: User is sent straight to `/admin/dashboard`.
    *   *Edge Case*: If the user previously abandoned setup, they are prompted to resume.

---

## 3. Onboarding Experience (Mobile Optimized)

**Goal**: Streamlined setup for *new* accounts.

1.  **Mobile Header**: Minimalist design with a black progress bar (Mobile Only).
2.  **Step 1: Business Basics**:
    *   **UI**: Focused form inputs (Name, Category).
    *   **Smart Layout**: Desktop-only "Live Preview" is hidden on mobile to prevent clutter.
3.  **Step 2: Operational Model**:
    *   Intelligent defaults based on business type selection.
4.  **Completion**:
    *   Database updated: `onboardingCompleted = true`.
    *   Seamless transition to the Admin Dashboard.

---

## 3. The Merchant Dashboard (The "App" Experience)

**Route**: `/admin/dashboard`

### A. Navigation (The "Native" Feel)
*   **Bottom Tab Bar** (Mobile Only):
    *   `Home`: Main Dashboard.
    *   `Orders`: Order Management.
    *   `Products`: Inventory.
    *   `Menu`: Opens the detailed Slide-Out Drawer.
*   **Sticky Header**: Stays fixed at the top with "Visit Store" and "User Profile".

### B. Dashboard Content (Performance Optimized)
*   **Lazy Loading**: Heavy widgets (Setup Checklist, Business Health) show a **Skeleton** (grey pulse) instantly, then fade in the content.
*   **Layout**: Single column card layout. No horizontal scrolling required.

---

## 4. Merchant Features

### Order Management (`/admin/orders`)
*   **List View**: Shows cards with "Order Ref", "Total", and "Status Badges".
*   **Search**: Filter by customer name or ID.
*   **Badges**: Color-coded (Green for Paid, Gray for Pending) using the app's design system.

### Products & Storefront
*   **Go Live**: User can tap "Publish" to make their store public.
*   **Storefront**: The actual customer-facing site is fully responsive and linked via the "Visit Store" chip.

---

## 5. Data Architecture

*   **Database**: PostgreSQL (Prisma ORM).
*   **Auth**: NextAuth.js (Secure HttpOnly Cookies).
*   **State**: React Context (`OnboardingContext`) for multi-step forms, persisting to DB on "Save & Exit".
*   **API**: Next.js App Router Server Actions for sensitive logic (Payment, Onboarding save).

---

## Summary of Recent "App-Like" Polish
*   **Bottom Nav**: Added for thumb-friendly navigation.
*   **Drawer**: Constrained width, shadow overlay, proper "Close" button.
*   **Onboarding**: Hidden sidebars, reduced padding/headers for small screens.
*   **Performance**: Lazy-loaded dashboard components for fast startup.
