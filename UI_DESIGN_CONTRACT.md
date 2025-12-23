# VAYVA UI DESIGN SPECIFICATION (DETAILED & LOCKED)

This document defines **how every surface should look, feel, and behave**.
If a page does not match this description, it is **wrong**.

---

## 1. OVERALL DESIGN PHILOSOPHY

### Personality

* Professional
* Calm
* Trustworthy
* Enterprise-grade
* Nigerian fintech–appropriate (serious, not flashy)

This is **not**:

* a startup experiment
* a crypto UI
* a flashy SaaS demo
* a consumer social app

---

### Visual Tone

* Flat, clean surfaces
* Soft contrast
* Clear hierarchy
* No visual noise
* No surprises

Every page should feel like:

> "This company handles real businesses and real money."

---

## 2. COLOR SYSTEM (EXACT USAGE)

### Primary

* **Green (`#22C55E`)**

  * Used ONLY for:

    * Primary CTAs
    * Success states
    * Active indicators
  * Never used as background wash
  * Never used excessively

### Dark

* **Charcoal (`#0B1220`)**

  * Sidebar background
  * Footer background
  * Header background (dashboard only)

### Neutrals

* **Background Light (`#F7FAF7`)**

  * Main page backgrounds
* **White (`#FFFFFF`)**

  * Cards
  * Auth containers
  * Forms

### Text

* **Primary Text (`#0F172A`)**
* **Muted Text (`#64748B`)**
* **Borders (`#E5E7EB`)**

❌ No gradients
❌ No transparency effects
❌ No glassmorphism

---

## 3. TYPOGRAPHY (VERY IMPORTANT)

### Font

* **Inter** only

### Headings

* Semi-bold
* Clear size steps
* Never decorative

### Body Text

* Regular weight
* Comfortable line height
* Designed for reading, not marketing hype

### Rules

* No uppercase paragraphs
* No overly tight spacing
* No "hero typography experiments"

---

## 4. BUTTONS & INTERACTIONS

### Primary Button

* Solid green background
* White text
* Subtle rounded corners
* No shadow
* No animation beyond hover darken

### Secondary Button

* White background
* Dark border
* Dark text

### Disabled State

* Greyed out
* Clearly non-interactive
* No hover effects

Buttons should feel:

> "Reliable, not playful."

---

## 5. MARKETING WEBSITE (PORT 3000)

### Header

* White background
* Logo on left
* Links centered/right
* Login / Signup clearly visible
* Sticky on scroll

### Sections

* Large spacing between sections
* Clear section titles
* Long-form explanatory text
* Icons used sparingly
* Images are illustrative, not dominant

### Footer

* Dark charcoal background
* White text
* Legal links grouped
* Contact info visible

No dashboards.
No auth UI.
No cards that look like app UI.

---

## 6. AUTHENTICATION PAGES (CRITICAL DESIGN)

This is the design you referenced and want preserved.

### Layout

* Full page neutral background
* Centered card (fixed width)
* White card
* Soft border
* Very subtle shadow

### Card Contents

* Vayva logo at top
* Clear page title ("Sign in", "Create account")
* Inputs stacked vertically
* Primary green button at bottom
* Minimal helper text

### Absolutely NOT allowed

* Sidebar
* Header
* Footer
* Dashboard elements
* Any reuse of app layout

The auth pages must feel:

> "Quiet, focused, safe."

---

## 7. ONBOARDING FLOW

### Layout

* Same visual language as auth
* No sidebar
* No marketing header
* Neutral background

### Structure

* Progress indicator at top
* One step per page
* Clear primary action
* No secondary distractions

### Goal

Guide the user, not impress them.

---

## 8. MERCHANT DASHBOARD (PORT 3000)

### Entry Rule

Dashboard **must not exist visually** until:

* Login is complete
* Onboarding is complete

---

### Layout

* **Left Sidebar**

  * Dark charcoal
  * White text
  * Icons + labels
  * Fixed width
* **Top Header**

  * Light background
  * Page title
  * User menu

### Main Content

* Light background
* Cards for data
* Clear spacing
* No dense tables unless needed

### Sidebar Rules

* Always visible when authenticated
* Never visible otherwise
* No dynamic reordering
* No collapsing into other layouts

---

## 9. OPS CONSOLE (PORT 3002)

### Important

Ops UI is:

* Internal
* Functional
* Less polished visually
* But still clean

### Login

* Same isolation rules as merchant auth
* No sidebar before login

### Dashboard

* Sidebar allowed
* Denser UI acceptable
* Still no chaos

Ops UI **must never affect** port 3000.

---

## 10. WHAT CAUSES DESIGN DRIFT (AND MUST NEVER HAPPEN)

* Reusing layouts "temporarily"
* Letting build failures fall back to old UI
* Allowing AI to "improve" visuals
* Having multiple sources of UI truth
* Conditional layouts based on runtime errors

---

## 11. FINAL MENTAL CHECK

If someone reloads the app:

* The UI should look **identical**
* The layout should not change
* The design should not "snap" to something else
* There should be no visual surprise

If any of that happens → the design contract is broken.

---

## 12. ENFORCEMENT

This specification is **locked**.

Any changes to UI must:
1. Reference this document
2. Explain why the change is needed
3. Update this document if approved

No AI or developer may "improve" the design without explicit approval.
