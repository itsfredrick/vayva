import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Skeleton } from "@/components/ui/skeleton";
export function DashboardHeader({ heading, text, children, action, }) {
    return (_jsxs("div", { className: "flex items-center justify-between px-2", children: [_jsxs("div", { className: "grid gap-1", children: [_jsx("h1", { className: "font-heading text-3xl md:text-4xl", children: heading }), text && _jsx("p", { className: "text-lg text-muted-foreground", children: text })] }), action ? action : children] }));
}
DashboardHeader.Skeleton = function DashboardHeaderSkeleton() {
    return (_jsxs("div", { className: "flex items-center justify-between px-2", children: [_jsxs("div", { className: "grid gap-1", children: [_jsx(Skeleton, { className: "h-9 w-48" }), _jsx(Skeleton, { className: "h-5 w-64" })] }), _jsx(Skeleton, { className: "h-9 w-24" })] }));
};
