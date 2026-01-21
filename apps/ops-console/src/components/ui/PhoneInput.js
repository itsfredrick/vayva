"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { cn } from "@/lib/utils";
export const PhoneInput = ({ value, onChange, label, error, helperText, className, ...props }) => {
    const [focused, setFocused] = useState(false);
    const formatPhoneNumber = (input) => {
        // Remove all non-digits
        const digits = input.replace(/\D/g, "");
        // Remove leading 234 or 0 if present
        let cleaned = digits;
        if (cleaned.startsWith("234")) {
            cleaned = cleaned.slice(3);
        }
        else if (cleaned.startsWith("0")) {
            cleaned = cleaned.slice(1);
        }
        // Limit to 10 digits (Nigerian phone numbers)
        cleaned = cleaned.slice(0, 10);
        return cleaned;
    };
    const handleChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        onChange(formatted);
    };
    const displayValue = value ? `+234 ${value}` : "";
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { className: "block text-sm font-medium text-text-primary mb-1.5", children: label })), _jsx("div", { className: "relative", children: _jsx("input", { type: "tel", value: displayValue, onChange: handleChange, onFocus: () => setFocused(true), onBlur: () => setFocused(false), placeholder: "+234 8012345678", className: cn("flex h-11 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary transition-all", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:border-primary", "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-background-light", error && "border-status-danger focus-visible:ring-status-danger", className), ...props }) }), helperText && (_jsx("p", { className: cn("mt-1.5 text-xs", error ? "text-status-danger" : "text-text-secondary"), children: helperText })), !helperText && !error && (_jsx("p", { className: "mt-1.5 text-xs text-text-tertiary", children: "Nigerian phone number (10 digits)" }))] }));
};
