"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "@/lib/utils";
const SelectContext = React.createContext({});
export const Select = ({ children, value, onValueChange, defaultValue, disabled, }) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "");
    const resolvedValue = value !== undefined ? value : internalValue;
    const handleValueChange = (newValue) => {
        setInternalValue(newValue);
        onValueChange?.(newValue);
    };
    // Capture children options for native select
    // This is a rough shim. Ideally we render a native select here.
    return (_jsx(SelectContext.Provider, { value: { value: resolvedValue, onValueChange: handleValueChange }, children: _jsx("div", { className: cn("relative", disabled && "opacity-50 pointer-events-none"), children: children }) }));
};
export const SelectPrimitive = {
    Root: Select,
    Trigger: React.forwardRef(({ children, className, ...props }, ref) => (_jsx("div", { className: cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm", className), children: children }))),
    Value: ({ placeholder, children }) => (_jsx("span", { className: "text-sm", children: children || placeholder })),
    Content: ({ children, className }) => (_jsx("div", { className: cn("absolute top-full left-0 w-full border bg-background z-50 mt-1 shadow-md rounded-md", className), children: children })),
    Item: React.forwardRef(({ children, className, value, ...props }, ref) => {
        const { onValueChange } = React.useContext(SelectContext);
        return (_jsx("div", { ref: ref, onClick: () => onValueChange?.(value), className: cn("cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground", className), ...props, children: children }));
    }),
};
// Exports matching shadcn pattern
export const SelectGroup = ({ children }) => _jsx("div", { children: children });
export const SelectValue = SelectPrimitive.Value;
export const SelectTrigger = SelectPrimitive.Trigger;
export const SelectContent = SelectPrimitive.Content;
export const SelectLabel = ({ children, className }) => (_jsx("div", { className: cn("px-2 py-1.5 text-sm font-semibold", className), children: children }));
export const SelectItem = SelectPrimitive.Item;
export const SelectSeparator = ({ className }) => (_jsx("div", { className: cn("-mx-1 my-1 h-px bg-muted", className) }));
