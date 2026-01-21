import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, EmptyState } from "@vayva/ui";
export default function LogisticsPage() {
    const shipments = [];
    if (shipments.length === 0) {
        return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-2xl font-bold mb-6 text-white text-3xl", children: "Deliveries" }), _jsx(EmptyState, { title: "No deliveries yet", icon: "Truck", description: "When you start shipping orders to customers, you can track them here.", action: _jsx(Button, { className: "px-8", children: "View Shipping Settings" }) })] }));
    }
    return (_jsx("div", { className: "p-6", children: _jsx("h1", { className: "text-2xl font-bold mb-6 text-white text-3xl", children: "Deliveries" }) }));
}
