import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "@/lib/utils";
export const Toast = React.forwardRef(({ className, ...props }, ref) => {
    return _jsx("div", { ref: ref, className: cn("toast", className), ...props });
});
Toast.displayName = "Toast";
export const ToastAction = React.forwardRef(({ className, ...props }, ref) => {
    return (_jsx("button", { ref: ref, className: cn("toast-action", className), ...props }));
});
ToastAction.displayName = "ToastAction";
