# 4) Create delivery task (from order)

## STABILITY MODE (APPLY — DO NOT DEVIATE)

- Page: `/admin/orders/[id]/delivery` (or modal? Prompt implies a screen but calls it "Create task"). Let's go with a sub-route or full page for clarity as per "Layout: Two-column panel".

## Layout

- Title: **Create delivery task**
- **Form (Left)**: Method, Window (Date/Time), Assigned To, Fee (Read-only), Notes.
- **Summary (Right)**: Address + Package info.
- **Actions**: Create task (Primary), Cancel.
