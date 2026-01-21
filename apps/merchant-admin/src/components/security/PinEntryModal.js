"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Icon, cn } from "@vayva/ui";
export const PinEntryModal = ({ isOpen, title = "Enter Security PIN", description = "Please verify your identity to continue.", onSuccess, onClose, isSetupMode = false, }) => {
    const [pin, setPin] = useState(["", "", "", ""]);
    const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
    const [step, setStep] = useState("enter"); // for setup mode
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputsRef = useRef([]);
    // Focus management
    useEffect(() => {
        if (isOpen) {
            // Slight delay to allow animation
            setTimeout(() => {
                inputsRef.current[0]?.focus();
            }, 100);
            setPin(["", "", "", ""]);
            setConfirmPin(["", "", "", ""]);
            setStep("enter");
            setError(null);
        }
    }, [isOpen]);
    const handleInput = (index, value, isConfirm = false) => {
        // Only numbers
        if (!/^\d*$/.test(value))
            return;
        const currentPin = isConfirm ? confirmPin : pin;
        const setCurrent = isConfirm ? setConfirmPin : setPin;
        const newPin = [...currentPin];
        newPin[index] = value.slice(-1); // Take last char
        setCurrent(newPin);
        // Auto advance
        if (value && index < 3) {
            inputsRef.current[isConfirm ? index + 4 : index + 1]?.focus();
        }
        // Auto submit if full
        if (newPin.every((d) => d !== "") && index === 3) {
            handleSubmit(newPin.join(""), isConfirm);
        }
    };
    const handleKeyDown = (index, e, isConfirm = false) => {
        const currentPin = isConfirm ? confirmPin : pin;
        const setCurrent = isConfirm ? setConfirmPin : setPin;
        if (e.key === "Backspace" && !currentPin[index] && index > 0) {
            inputsRef.current[isConfirm ? index - 1 + 4 : index - 1]?.focus();
        }
    };
    const handleSubmit = async (code, isConfirm) => {
        setError(null);
        if (isSetupMode) {
            if (step === "enter" && !isConfirm) {
                // Determine if we move to confirm step
                setStep("confirm");
                setTimeout(() => inputsRef.current[4]?.focus(), 100);
                return;
            }
            if (isConfirm) {
                if (code !== pin.join("")) {
                    setError("PINs do not match. Try again.");
                    setConfirmPin(["", "", "", ""]);
                    setTimeout(() => inputsRef.current[4]?.focus(), 100);
                    return;
                }
                // Determine action: Setup
                await performAction("setup", code);
            }
        }
        else {
            // Verify
            await performAction("verify", code);
        }
    };
    const performAction = async (action, code) => {
        setIsLoading(true);
        try {
            const endpoint = action === "verify" ? "/api/auth/pin/verify" : "/api/auth/pin/setup";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pin: code }),
            });
            const data = await res.json();
            if (res.ok) {
                onSuccess();
            }
            else {
                setError(data.error || "Verification failed");
                if (action === "verify") {
                    // Shake effect or reset
                    setPin(["", "", "", ""]);
                    setTimeout(() => inputsRef.current[0]?.focus(), 100);
                }
            }
        }
        catch (err) {
            setError("Network error. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    };
    if (!isOpen)
        return null;
    return (_jsx(AnimatePresence, { children: _jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm", children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, className: "bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 relative overflow-hidden", children: [_jsx("div", { className: "absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-2xl opacity-50 pointer-events-none" }), _jsxs("div", { className: "text-center mb-8 relative z-10", children: [_jsx("div", { className: "w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-sm border border-indigo-100", children: _jsx(Icon, { name: "LockKeyhole", size: 32 }) }), _jsx("h2", { className: "text-xl font-bold text-gray-900", children: isSetupMode
                                    ? step === "enter"
                                        ? "Create a PIN"
                                        : "Confirm PIN"
                                    : title }), _jsx("p", { className: "text-sm text-gray-500 mt-2", children: isSetupMode
                                    ? step === "enter"
                                        ? "Set a 4-digit PIN for extra security."
                                        : "Re-enter to confirm."
                                    : description })] }), _jsxs("div", { className: "space-y-6 relative z-10", children: [_jsx("div", { className: "flex justify-center gap-3", children: (step === "enter" ? pin : confirmPin).map((digit, i) => (_jsx("input", { type: "password", inputMode: "numeric", maxLength: 1, ref: (el) => {
                                        inputsRef.current[step === "enter" ? i : i + 4] = el;
                                    }, value: digit, onChange: (e) => handleInput(i, e.target.value, step === "confirm"), onKeyDown: (e) => handleKeyDown(i, e, step === "confirm"), className: cn("w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all", error
                                        ? "border-red-200 bg-red-50 text-red-600 focus:border-red-500"
                                        : "border-gray-200 bg-gray-50 focus:border-black focus:bg-white focus:shadow-lg"), disabled: isLoading }, i))) }), error && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "text-red-500 text-xs text-center font-medium bg-red-50 py-2 rounded-lg", children: error })), _jsxs("div", { className: "flex flex-col gap-3 mt-4", children: [isLoading && (_jsx("div", { className: "text-center text-xs text-gray-400 animate-pulse", children: "Verifying secure PIN..." })), !isSetupMode && (_jsx(Button, { className: "text-xs text-gray-400 hover:text-gray-900 transition-colors", children: "Forgot PIN?" })), onClose && (_jsx(Button, { variant: "ghost", onClick: onClose, size: "sm", className: "w-full text-gray-400 hover:text-gray-900", children: "Cancel" }))] })] })] }) }) }));
};
