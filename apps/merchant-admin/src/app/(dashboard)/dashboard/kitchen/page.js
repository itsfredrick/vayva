import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { KitchenBoard } from "@/components/kitchen/KitchenBoard";
export default function KitchenPage() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Kitchen Display" }), _jsx("p", { className: "text-muted-foreground", children: "Live incoming orders. Auto-refreshes every 15s." })] }) }), _jsx(KitchenBoard, {})] }));
}
