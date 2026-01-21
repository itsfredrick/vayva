import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon, Button } from "@vayva/ui";
const ICON_MAP = {
    done: "Check",
    pending: "Clock",
    error: "AlertTriangle",
    check: "Check",
    priority_high: "AlertCircle",
};
export function RequirementChecklist({ items }) {
    return (_jsx("div", { className: "space-y-3", children: items.map((item, i) => (_jsxs("div", { className: "flex items-start justify-between p-3 bg-white/5 rounded-lg border border-white/5", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `mt - 0.5 w - 5 h - 5 rounded - full flex items - center justify - center shrink - 0 ${item.met ? "bg-state-success/20 text-state-success" : "bg-state-warning/20 text-state-warning"} `, children: _jsx(Icon, { name: (item.met ? "Check" : "AlertTriangle"), size: 14 }) }), _jsx("span", { className: `text - sm ${item.met ? "text-white" : "text-text-secondary"} `, children: item.label })] }), !item.met && item.link && (_jsx(Button, { variant: "link", className: "text-xs text-primary font-bold hover:underline whitespace-nowrap ml-4 h-auto p-0", children: "Fix now" }))] }, i))) }));
}
