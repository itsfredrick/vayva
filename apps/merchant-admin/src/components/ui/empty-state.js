import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
export function EmptyState({ icon: Icon = PlusCircle, title, description, actionLabel, actionHref, actiononClick, }) {
    return (_jsx("div", { className: "flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed text-center animate-in fade-in-50", children: _jsxs("div", { className: "mx-auto flex max-w-[420px] flex-col items-center justify-center text-center", children: [_jsx("div", { className: "flex h-20 w-20 items-center justify-center rounded-full bg-muted", children: _jsx(Icon, { className: "h-10 w-10 text-muted-foreground" }) }), _jsx("h3", { className: "mt-4 text-lg font-semibold", children: title }), _jsx("p", { className: "mb-4 mt-2 text-sm text-muted-foreground", children: description }), actionLabel && (actionHref || actiononClick) && (actionHref ? (_jsx(Link, { href: actionHref, children: _jsxs(Button, { children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), actionLabel] }) })) : (_jsxs(Button, { onClick: actiononClick, children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), actionLabel] })))] }) }));
}
