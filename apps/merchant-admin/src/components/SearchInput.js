"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input, Button } from "@vayva/ui";
export function SearchInput({ value, onChange, placeholder = "Search...", debounceMs = 300, className = "", }) {
    const [localValue, setLocalValue] = useState(value);
    // Sync with external value changes
    useEffect(() => {
        setLocalValue(value);
    }, [value]);
    // Debounced onChange
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localValue !== value) {
                onChange(localValue);
            }
        }, debounceMs);
        return () => clearTimeout(timer);
    }, [localValue, debounceMs, onChange, value]);
    const handleClear = useCallback(() => {
        setLocalValue("");
        onChange("");
    }, [onChange]);
    // Keyboard shortcut: Cmd/Ctrl + K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                const input = document.querySelector('[data-search-input]');
                input?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    return (_jsxs("div", { className: `relative ${className}`, children: [_jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", children: _jsx(Search, { className: "h-4 w-4" }) }), _jsx(Input, { "data-search-input": true, type: "text", value: localValue, onChange: (e) => setLocalValue(e.target.value), placeholder: placeholder, className: "pl-10 pr-10", "aria-label": placeholder }), localValue && (_jsx(Button, { variant: "ghost", size: "icon", onClick: handleClear, className: "absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-transparent", "aria-label": "Clear search", type: "button", children: _jsx(X, { className: "h-4 w-4" }) })), _jsx("div", { className: "sr-only", role: "status", "aria-live": "polite", children: localValue ? `Searching for ${localValue}` : "" })] }));
}
