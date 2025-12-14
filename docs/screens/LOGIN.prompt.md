VAYVA ADMIN “STABILITY MODE” — GLOBAL THEME + APP SHELL CONTRACT (DO NOT DEVIATE)

SOURCE OF TRUTH:

* Use the uploaded Vendly theme pack as the base style, but rename Vendly → Vayva.
* HARD REQUIREMENT: ALL ADMIN SCREENS MUST USE THE SAME APP SHELL (LEFT SIDEBAR + TOP HEADER). No top-nav-only layouts.

MODE LOCK:

* Dark mode ONLY. Never use light mode or light backgrounds.
* Background color token: background-dark = #142210.
* Page background treatment: subtle dark abstract image or gradient + dark overlay at 85–92% opacity for readability.
* Glass panel style must match exactly:

  * glass-panel bg: rgba(20, 34, 16, 0.70)
  * blur: 20px
  * border: 1px solid rgba(255,255,255,0.08)

CORE TOKENS (LOCKED):

* Primary: #46EC13
* Primary hover: slightly darker green (≈ #3DD10F)
* Text primary: #FFFFFF
* Text secondary: rgba(255,255,255,0.65)
* Border subtle: rgba(255,255,255,0.08)
* Muted chip bg: rgba(255,255,255,0.06)
* Warning: #F59E0B | Danger: #EF4444 | Info: #3B82F6

TYPOGRAPHY (LOCKED):

* Font: Manrope for everything.
* Heading weights: 700–800. Body: 500–600. Micro labels: uppercase + tracking.

ICONS (LOCKED):

* Material Symbols Outlined. Icon size 20–24px.

RADIUS + SPACING (LOCKED):

* 8px spacing scale (8/16/24/32/40).
* Nav items: rounded-xl.
* Cards/panels: rounded-2xl.
* Buttons/inputs: pill-rounded.

ADMIN APP SHELL (MUST BE IDENTICAL ON EVERY SCREEN):
A) LEFT SIDEBAR: width 288px, glass-panel, logo “Vayva” + “Seller Dashboard”
Nav order fixed:

1. Home (Dashboard) 2) Orders 3) Products 4) Customers 5) Analytics 6) Marketplace 7) Storefront 8) WhatsApp AI 9) Settings
   Active item style: bg primary/20 + border primary/20 + soft green glow.

B) TOP HEADER: height 68–76px, translucent + blur, bottom border subtle.
Left: breadcrumb + page title. Right: store selector pill + bell + avatar.

C) MAIN CONTENT: max width 1200–1280 centered. Glass panels only.

COMPONENT RULES (LOCKED):

* Primary button: #46EC13 pill + dark text + soft glow.
* Secondary: glass outline.
* Inputs: dark glass + green focus ring.

IMPORTANT: CHANGE ONLY MAIN CONTENT PER SCREEN.

EXPORT:

* Single frame only. Desktop 1440×1024.
* Nigeria data examples (₦, Lagos/Abuja).

========================
SCREEN: Login (Admin)
Goal: Merchant logs into Vayva Admin.

Main content (centered column inside a large glass panel, but still within the admin shell):

* Title: “Welcome back”
* Subtitle: “Log in to manage your store, orders, and WhatsApp AI.”
* Form fields:

  1. Email or phone (placeholder: “[name@domain.com](mailto:name@domain.com) or +234 801 234 5678”)
  2. Password with show/hide icon
* Row beneath password:

  * Left: “Remember me” checkbox
  * Right: “Forgot password?” link
* Primary CTA: “Log in” (full width)
* Secondary CTA: “Continue with Google” (outline, with icon)
* Tertiary text: “New to Vayva? Create an account” link
* Security microcopy (muted): “We’ll never message customers without your permission.”

States (must be visually shown within the screen):

* Error state example beneath email: “This account doesn’t exist.”
* Disabled state of login button when fields empty (hinted).
* Loading state style (spinner inside button) shown as a small annotation block or secondary example row (do not create another screen).

Header breadcrumb: “Auth / Login”
Top-right: store selector pill should show “No store yet” state (disabled look).
Sidebar: all items visible, but none active; optionally highlight “Home” subtly to keep shell consistent.
