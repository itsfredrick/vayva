import { jsx as _jsx } from "react/jsx-runtime";
import { StatusChip } from "@vayva/ui";
export const Badge = ({ children, variant = "default", }) => {
    // Map variants to StatusChip type
    let type = "neutral";
    if (variant === "default")
        type = "success";
    if (variant === "destructive")
        type = "error";
    if (variant === "secondary")
        type = "info";
    // StatusChip expects 'status' string as content and 'type' as style
    return _jsx(StatusChip, { status: String(children), type: type });
};
