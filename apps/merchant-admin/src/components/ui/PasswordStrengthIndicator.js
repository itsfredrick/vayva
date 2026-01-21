"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../utils";
const requirements = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
    { label: "One number", test: (p) => /\d/.test(p) },
    {
        label: "One special character",
        test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
    },
];
export const PasswordStrengthIndicator = ({ password }) => {
    const metRequirements = requirements.filter((req) => req.test(password));
    const strength = metRequirements.length;
    const getStrengthLabel = () => {
        if (strength === 0)
            return "";
        if (strength <= 2)
            return "Weak";
        if (strength <= 4)
            return "Medium";
        return "Strong";
    };
    const getStrengthColor = () => {
        if (strength <= 2)
            return "bg-status-danger";
        if (strength <= 4)
            return "bg-status-warning";
        return "bg-status-success";
    };
    if (!password)
        return null;
    return (_jsxs("div", { className: "space-y-2 mt-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex-1 h-1.5 bg-background-light rounded-full overflow-hidden", children: _jsx("div", { className: cn("h-full transition-all duration-300", getStrengthColor()), style: { width: `${(strength / requirements.length) * 100}%` } }) }), getStrengthLabel() && (_jsx("span", { className: cn("text-xs font-medium", strength <= 2 && "text-status-danger", strength > 2 && strength <= 4 && "text-status-warning", strength === 5 && "text-status-success"), children: getStrengthLabel() }))] }), _jsx("ul", { className: "space-y-1", children: requirements.map((req, index) => {
                    const isMet = req.test(password);
                    return (_jsxs("li", { className: cn("text-xs flex items-center gap-1.5 transition-colors", isMet ? "text-status-success" : "text-text-tertiary"), children: [_jsx("span", { className: cn("w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px]", isMet
                                    ? "bg-status-success text-white"
                                    : "bg-background-light"), children: isMet && "✓" }), req.label] }, index));
                }) })] }));
};
