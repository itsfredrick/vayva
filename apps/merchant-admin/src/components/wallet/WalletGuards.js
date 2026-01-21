"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Link from "next/link";
import { Button, Icon } from "@vayva/ui";
import { useWallet } from "@/context/WalletContext";
// 1. KYC Block Screen
export const KycBlockScreen = () => (_jsxs("div", { className: "flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto p-6", children: [_jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-500", children: _jsx(Icon, { name: "ShieldAlert", size: 32 }) }), _jsx("h2", { className: "text-2xl font-bold text-black mb-2", children: "Complete KYC to unlock your wallet" }), _jsx("p", { className: "text-[#525252] mb-8", children: "To ensure the security of your funds and comply with regulations, we need to verify your identity (BVN/NIN) before you can access payouts." }), _jsxs("div", { className: "flex gap-4", children: [_jsx(Link, { href: "/dashboard/settings/kyc", children: _jsx(Button, { children: "Complete Verification" }) }), _jsx(Link, { href: "/admin", children: _jsx(Button, { variant: "outline", children: "Back to Dashboard" }) })] })] }));
// 2. PIN Setup Screen
export const PinSetupScreen = () => {
    const { setPin } = useWallet();
    const [pin, setPinValue] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pin.length !== 4)
            return;
        setLoading(true);
        await setPin(pin);
        setLoading(false);
    };
    return (_jsxs("div", { className: "flex flex-col items-center justify-center h-[60vh] text-center max-w-sm mx-auto p-6", children: [_jsx("div", { className: "w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600", children: _jsx(Icon, { name: "LockKeyhole", size: 32 }) }), _jsx("h2", { className: "text-2xl font-bold text-black mb-2", children: "Create Wallet PIN" }), _jsx("p", { className: "text-[#525252] mb-8", children: "Set a secure 4-digit PIN to authorize withdrawals and sensitive actions." }), _jsxs("form", { onSubmit: handleSubmit, className: "w-full flex flex-col gap-4", children: [_jsx("input", { type: "password", maxLength: 4, placeholder: "0000", className: "text-center text-3xl tracking-[1em] font-bold border-b-2 border-gray-200 py-2 focus:border-black focus:outline-none bg-transparent", value: pin, onChange: (e) => setPinValue(e.target.value.replace(/\D/g, "")) }), _jsx(Button, { type: "submit", disabled: pin.length !== 4 || loading, className: "w-full", children: loading ? "Setting PIN..." : "Set Secure PIN" })] })] }));
};
// 3. Unlock Screen
export const UnlockScreen = () => {
    const { unlockWallet } = useWallet();
    const [pin, setPinValue] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pin.length !== 4)
            return;
        setLoading(true);
        setError(false);
        const success = await unlockWallet(pin);
        if (!success) {
            setError(true);
            setPinValue("");
        }
        setLoading(false);
    };
    return (_jsxs("div", { className: "flex flex-col items-center justify-center h-[60vh] text-center max-w-sm mx-auto p-6", children: [_jsx("div", { className: "w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-black", children: _jsx(Icon, { name: "Lock", size: 32 }) }), _jsx("h2", { className: "text-2xl font-bold text-black mb-2", children: "Unlock Wallet" }), _jsx("p", { className: "text-[#525252] mb-8", children: "Enter your 4-digit PIN to access your funds." }), _jsxs("form", { onSubmit: handleSubmit, className: "w-full flex flex-col gap-4", children: [_jsx("input", { type: "password", maxLength: 4, placeholder: "\u2022\u2022\u2022\u2022", className: `text-center text-3xl tracking-[1em] font-bold border-b-2 py-2 focus:outline-none bg-transparent transition-colors
                        ${error ? "border-red-500 text-red-500" : "border-gray-200 focus:border-black"}`, value: pin, onChange: (e) => {
                            setPinValue(e.target.value.replace(/\D/g, ""));
                            setError(false);
                        }, autoFocus: true }), _jsx(Button, { type: "submit", disabled: pin.length !== 4 || loading, className: "w-full", children: loading ? "Unlocking..." : "Unlock" }), error && _jsx("p", { className: "text-red-500 text-sm", children: "Incorrect PIN" }), _jsx(Button, { variant: "link", type: "button", className: "text-xs text-gray-500 hover:text-black hover:underline h-auto p-0 font-normal", children: "Forgot PIN?" })] })] }));
};
