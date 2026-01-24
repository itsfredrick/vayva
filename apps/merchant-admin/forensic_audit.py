
import os
import re

base_path = "/Users/fredrick/Documents/GitHub/vayva/apps/merchant-admin/src/app"
src_path = "/Users/fredrick/Documents/GitHub/vayva/apps/merchant-admin/src"

def get_parent_layouts(file_path):
    layouts = []
    current = os.path.dirname(file_path)
    while current.startswith(base_path):
        layout_path = os.path.join(current, "layout.tsx")
        if os.path.exists(layout_path):
            layouts.append(os.path.relpath(layout_path, src_path))
        current = os.path.dirname(current)
    # Check root layout
    root_layout = os.path.join(base_path, "layout.tsx")
    if os.path.exists(root_layout) and os.path.relpath(root_layout, src_path) not in layouts:
        layouts.append(os.path.relpath(root_layout, src_path))
    return layouts

def checks_admin_shell(file_path):
    # This is a heuristic: does the layout or page import/use AdminShell?
    # Or does its parent layout?
    layouts = get_parent_layouts(file_path)
    for l in layouts:
        full_l = os.path.join(src_path, l)
        if os.path.exists(full_l):
            with open(full_l, 'r') as f:
                content = f.read()
                if "AdminShell" in content:
                    return f"Yes (via {l})"
    
    with open(file_path, 'r') as f:
        content = f.read()
        if "AdminShell" in content:
            return "Yes (Direct)"
    
    return "No"

def extract_gating(file_path):
    guards = []
    with open(file_path, 'r') as f:
        content = f.read()
        # Look for typical gating patterns
        if "useAuth" in content or "useSession" in content:
            guards.append("Client Auth Hook")
        if "redirect(" in content:
            guards.append("Auth Redirect")
        if "PermissionGate" in content:
            guards.append("PermissionGate Component")
        if "getServerSession" in content:
            guards.append("Server Session Check")
    return ", ".join(guards) if guards else "None identified"

print("## Page/Layout Routes")
for root, dirs, files in os.walk(base_path):
    for file in files:
        if file in ["page.tsx", "layout.tsx", "loading.tsx", "error.tsx", "not-found.tsx"]:
            full_path = os.path.join(root, file)
            rel_app_path = os.path.relpath(root, base_path)
            route_path = "/" + rel_app_path.replace("\\", "/").replace("(dashboard)/", "").replace("(auth)/", "")
            if route_path == "/.": route_path = "/"
            
            parent_layouts = get_parent_layouts(full_path)
            admin_shell = checks_admin_shell(full_path)
            gating = extract_gating(full_path)
            
            print(f"- **Route**: {route_path}")
            print(f"  **File**: {os.path.relpath(full_path, src_path)}")
            print(f"  **Parents**: {', '.join(parent_layouts)}")
            print(f"  **Shell**: {admin_shell}")
            print(f"  **Gating**: {gating}")

print("\n## API Routes")
for root, dirs, files in os.walk(base_path):
    for file in files:
        if file == "route.ts":
            full_path = os.path.join(root, file)
            rel_app_path = os.path.relpath(root, base_path)
            route_path = "/api/" + rel_app_path.replace("\\", "/").replace("api/", "")
            
            methods = []
            with open(full_path, 'r') as f:
                content = f.read()
                for m in ["GET", "POST", "PUT", "DELETE", "PATCH"]:
                    if f"export async function {m}" in content or f"export const {m}" in content:
                        methods.append(m)
            
            print(f"- **Route**: {route_path}")
            print(f"  **Methods**: {', '.join(methods)}")
            print(f"  **File**: {os.path.relpath(full_path, src_path)}")
