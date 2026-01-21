import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@vayva/ui";
export const Switch = ({ checked, onCheckedChange, disabled, className, }) => {
    return (_jsx("button", { type: "button", role: "switch", "aria-checked": checked, disabled: disabled, onClick: () => onCheckedChange(!checked), className: cn("w-11 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black", checked ? "bg-green-500" : "bg-gray-200", disabled && "opacity-50 cursor-not-allowed", className), children: _jsx("span", { className: cn("block w-5 h-5 bg-white rounded-full shadow-sm transition-transform transform", checked ? "translate-x-5" : "translate-x-0.5", "mt-0.5 ml-0.5") }) }));
};
