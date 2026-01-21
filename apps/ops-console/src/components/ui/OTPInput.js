"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
export const OTPInput = ({ length = 6, value, onChange, onComplete, disabled = false, error = false, }) => {
    const inputRefs = useRef([]);
    const [focusedIndex, setFocusedIndex] = useState(null);
    const handleChange = (index, inputValue) => {
        if (disabled)
            return;
        // Only allow digits
        const digit = inputValue.replace(/\D/g, "").slice(-1);
        const newValue = value.split("");
        newValue[index] = digit;
        const updatedValue = newValue.join("");
        onChange(updatedValue);
        // Auto-advance to next input
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
        // Call onComplete when all digits are entered
        if (updatedValue.length === length && onComplete) {
            onComplete(updatedValue);
        }
    };
    const handleKeyDown = (index, e) => {
        if (disabled)
            return;
        if (e.key === "Backspace") {
            e.preventDefault();
            const newValue = value.split("");
            if (newValue[index]) {
                // Clear current digit
                newValue[index] = "";
                onChange(newValue.join(""));
            }
            else if (index > 0) {
                // Move to previous input and clear it
                newValue[index - 1] = "";
                onChange(newValue.join(""));
                inputRefs.current[index - 1]?.focus();
            }
        }
        else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        else if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    const handlePaste = (e) => {
        e.preventDefault();
        if (disabled)
            return;
        const pastedData = e.clipboardData
            .getData("text/plain")
            .replace(/\D/g, "")
            .slice(0, length);
        onChange(pastedData);
        // Focus the next empty input or the last input
        const nextIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
        if (pastedData.length === length && onComplete) {
            onComplete(pastedData);
        }
    };
    return (_jsx("div", { className: "flex gap-2 justify-center", children: Array.from({ length }).map((_, index) => (_jsx("input", { ref: (el) => {
                inputRefs.current[index] = el;
            }, type: "text", inputMode: "numeric", maxLength: 1, value: value[index] || "", onChange: (e) => handleChange(index, e.target.value), onKeyDown: (e) => handleKeyDown(index, e), onPaste: handlePaste, onFocus: () => setFocusedIndex(index), onBlur: () => setFocusedIndex(null), disabled: disabled, className: cn("w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 transition-all", "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2", "disabled:opacity-50 disabled:cursor-not-allowed", error
                ? "border-status-danger focus:border-status-danger"
                : focusedIndex === index
                    ? "border-primary"
                    : value[index]
                        ? "border-primary bg-background-light"
                        : "border-border", "bg-background text-text-primary"), "aria-label": `Digit ${index + 1}` }, index))) }));
};
