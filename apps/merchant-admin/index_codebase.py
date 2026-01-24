
import os
import re

def get_file_type(path, name):
    if name.startswith("page."): return "page"
    if name.startswith("layout."): return "layout"
    if name.startswith("route."): return "route"
    if "components" in path and name.endswith(".tsx"): return "component"
    if name.startswith("use") and name.endswith((".ts", ".tsx")): return "hook"
    if "context" in path or name.endswith("Context.tsx") or name.endswith("Context.ts"): return "context"
    if "types" in path or name.endswith((".d.ts", ".ts")) and "types" in name.lower(): return "type"
    if "config" in path: return "config"
    return "util"

def extract_exports(file_path):
    exports = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Match named exports: export const/function/class/type/interface Name
            named_matches = re.finditer(r'^export\s+(?:async\s+)?(?:const|var|let|function|class|type|interface|enum)\s+([a-zA-Z0-9_$]+)', content, re.MULTILINE)
            for m in named_matches:
                exports.append(m.group(1))
            
            # Match export { ... }
            bracket_matches = re.finditer(r'^export\s+\{([^}]+)\}', content, re.MULTILINE)
            for m in bracket_matches:
                items = [i.strip().split(' as ')[-1] for i in m.group(1).split(',')]
                exports.extend([i for i in items if i])

            # Match export default
            if re.search(r'^export\s+default\s+', content, re.MULTILINE):
                exports.append("default")
    except Exception:
        return "exports not extracted"
    
    return ", ".join(sorted(list(set(exports)))) if exports else "no exports"

dirs_to_index = [
    "src/app",
    "src/components",
    "src/context",
    "src/lib",
    "src/types",
    "src/config"
]

base_path = "/Users/fredrick/Documents/GitHub/vayva/apps/merchant-admin/"

for d in dirs_to_index:
    full_dir = os.path.join(base_path, d)
    print(f"\n## Directory: {d}")
    for root, dirs, files in os.walk(full_dir):
        # Sort for deterministic output
        dirs.sort()
        files.sort()
        for file in files:
            if file.endswith((".ts", ".tsx", ".js", ".jsx")):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, base_path)
                f_type = get_file_type(rel_path, file)
                exports = extract_exports(file_path)
                print(f"- **Path**: {rel_path}")
                print(f"  **Type**: {f_type}")
                print(f"  **Exports**: {exports}")
