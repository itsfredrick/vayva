import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { Plus } from "lucide-react";
export default function QuotesPage() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Quotes & Orders" }), _jsx("p", { className: "text-muted-foreground", children: "Manage B2B quotes and purchase orders." })] }), _jsxs(Button, { children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), " Create Quote"] })] }), _jsx("div", { className: "flex items-center justify-center h-64 border-2 border-dashed rounded-lg", children: _jsx("p", { className: "text-muted-foreground", children: "No pending quotes." }) })] }));
}
