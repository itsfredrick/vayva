import { jsx as _jsx } from "react/jsx-runtime";
import { Icon } from "@vayva/ui";
export function Spinner({ size = "md", className = "" }) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };
    return (_jsx("div", { className: `animate-spin text-primary ${sizeClasses[size]} ${className}`, children: _jsx(Icon, { name: "Loader", size: size === "sm" ? 16 : size === "md" ? 32 : 48 }) }));
}
