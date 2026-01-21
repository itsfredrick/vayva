import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
function Skeleton({ className, ...props }) {
    return (_jsx("div", { className: cn("animate-pulse rounded-md bg-neutral-200/50 dark:bg-neutral-800/50", className), ...props }));
}
export { Skeleton };
