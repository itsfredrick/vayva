import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon } from "@vayva/ui";
const RISK_CONFIG = {
    Low: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/20",
        icon: "CheckCircle",
        iconColor: "text-emerald-400",
    },
    Medium: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        border: "border-yellow-500/20",
        icon: "AlertTriangle",
        iconColor: "text-yellow-400",
    },
    High: {
        bg: "bg-red-500/10",
        text: "text-red-400",
        border: "border-red-500/20",
        icon: "AlertOctagon",
        iconColor: "text-red-400",
    },
};
export function RiskChip({ level, showIcon = true }) {
    const config = RISK_CONFIG[level];
    return (_jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-bold uppercase tracking-wider ${config.bg} ${config.text} ${config.border}`, children: [showIcon && (_jsx(Icon, { name: config.icon, size: 14, className: config.iconColor })), level, " Risk"] }));
}
