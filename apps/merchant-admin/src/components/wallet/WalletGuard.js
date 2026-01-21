"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { Button, Input } from "@vayva/ui";
import { toast } from "sonner"; // Assuming sonner is available based on package.json
export default function WalletGuard({ children }) {
    const [isLocked, setIsLocked] = useState(true);
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [noPinSet, setNoPinSet] = useState(false);
    // Check session on mount
    useEffect(() => {
        const unlocked = sessionStorage.getItem("wallet_unlocked");
        if (unlocked === "true") {
            setIsLocked(false);
        }
    }, []);
    const handleUnlock = async (e) => {
        if (e)
            e.preventDefault();
        if (pin.length < 4)
            return;
        setLoading(true);
        try {
            const res = await fetch("/api/wallet/pin/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pin })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                if (data.status === "no_pin_set") {
                    // Open mode or prompt setup. 
                    // For Guard, we allow access but maybe show warning?
                    // Plan said "if a PIN is set, show keypad". 
                    // If no PIN set, we should ideally let them through or force setup.
                    // Here we unlock and set a flag.
                    setNoPinSet(true);
                    setIsLocked(false);
                    toast.warning("Your wallet is unsecured. Please set a PIN in Account Settings.");
                }
                else {
                    sessionStorage.setItem("wallet_unlocked", "true");
                    setIsLocked(false);
                    toast.success("Wallet Unlocked");
                }
            }
            else {
                toast.error(data.error || "Incorrect PIN");
                setPin("");
            }
        }
        catch (error) {
            console.error("Unlock Error", error);
            toast.error("Failed to verify PIN");
        }
        finally {
            setLoading(false);
        }
    };
    if (!isLocked) {
        return _jsx(_Fragment, { children: children });
    }
    return (_jsx("div", { className: "min-h-[60vh] flex flex-col items-center justify-center p-6 bg-gray-50/50 rounded-2xl border border-gray-100", children: _jsxs("div", { className: "bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-sm w-full text-center space-y-6", children: [_jsx("div", { className: "w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Lock, { size: 32 }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Wallet Locked" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Enter your 4-6 digit PIN to access funds." })] }), _jsxs("form", { onSubmit: handleUnlock, className: "space-y-4", children: [_jsx("div", { className: "flex justify-center", children: _jsx(Input, { type: "password", className: "text-center text-2xl tracking-[1em] h-14 font-mono w-full", value: pin, onChange: (e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 6)), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022", autoFocus: true, maxLength: 6 }) }), _jsxs(Button, { type: "submit", disabled: pin.length < 4 || loading, className: "w-full h-12 text-base font-medium", children: [loading ? "Verifying..." : "Unlock Wallet", !loading && _jsx(ArrowRight, { size: 16, className: "ml-2" })] })] }), _jsx("div", { className: "text-center", children: _jsx(Button, { variant: "link", size: "sm", onClick: async () => {
                            const confirmReset = window.confirm("Send a PIN reset link to your email?");
                            if (!confirmReset)
                                return;
                            try {
                                toast.info("Sending reset link...");
                                const res = await fetch("/api/wallet/pin/reset-request", { method: "POST" });
                                const d = await res.json();
                                if (res.ok)
                                    toast.success(d.message);
                                else
                                    toast.error(d.error);
                            }
                            catch (e) {
                                toast.error("Failed to send reset link");
                            }
                        }, className: "text-xs text-gray-400 font-normal hover:text-gray-600", children: "Forgot PIN? Reset via Email" }) })] }) }));
}
