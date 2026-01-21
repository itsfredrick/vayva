import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { QrCode } from "lucide-react";
export default function CheckInPage() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Guest Check-in" }), _jsx("p", { className: "text-muted-foreground", children: "Scan tickets and manage event entry." })] }), _jsxs(Button, { children: [_jsx(QrCode, { className: "mr-2 h-4 w-4" }), " Open Scanner"] })] }), _jsx("div", { className: "flex items-center justify-center h-64 border-2 border-dashed rounded-lg", children: _jsx("p", { className: "text-muted-foreground", children: "Waiting for guests..." }) })] }));
}
