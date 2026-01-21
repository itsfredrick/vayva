"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Icon, Input } from "@vayva/ui";
export function KYCVerification({ onSuccess, onCancel }) {
    const [method, setMethod] = useState(null);
    const [consent, setConsent] = useState(false);
    const [formData, setFormData] = useState({
        idNumber: "",
        firstName: "",
        lastName: "",
        dob: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState("SELECT");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!consent) {
            setError("Consent is required to proceed");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/kyc/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    method,
                    ...formData,
                    consent,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Verification failed");
            }
            setStep("SUCCESS");
            if (onSuccess)
                onSuccess();
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    if (step === "SUCCESS") {
        return (_jsxs("div", { className: "text-center py-12 space-y-6", children: [_jsx("div", { className: "w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto", children: _jsx(Icon, { name: "CheckCircle", size: 40 }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-2xl font-bold text-white", children: "Verification Successful" }), _jsx("p", { className: "text-text-secondary", children: "Your identity has been verified system-wide." })] }), _jsx(Button, { onClick: onCancel, className: "w-full", children: "Return to Dashboard" })] }));
    }
    return (_jsxs("div", { className: "max-w-md mx-auto space-y-8 p-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-2xl font-bold text-white", children: "Identity Verification" }), _jsx("p", { className: "text-text-secondary font-medium", children: "Choose a method to verify your business identity." })] }), step === "SELECT" ? (_jsxs("div", { className: "grid grid-cols-1 gap-4", children: [_jsxs(Button, { onClick: () => {
                            setMethod("BVN");
                            setStep("FORM");
                        }, className: "p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all text-left group", children: [_jsx("div", { className: "p-3 bg-primary/20 text-primary rounded-xl group-hover:bg-primary group-hover:text-black transition-all", children: _jsx(Icon, { name: "CreditCard", size: 24 }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-white", children: "Bank Verification Number (BVN)" }), _jsx("p", { className: "text-xs text-text-secondary", children: "Instant verification via your 11-digit BVN." })] })] }), _jsxs(Button, { onClick: () => {
                            setMethod("NIN");
                            setStep("FORM");
                        }, className: "p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all text-left group", children: [_jsx("div", { className: "p-3 bg-white/10 text-white rounded-xl group-hover:bg-white group-hover:text-black transition-all", children: _jsx(Icon, { name: "Shield", size: 24 }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-white", children: "National Identity Number (NIN)" }), _jsx("p", { className: "text-xs text-text-secondary", children: "Verify using your 11-digit National ID." })] })] }), _jsx("div", { className: "pt-4", children: _jsx(Button, { variant: "ghost", onClick: onCancel, className: "w-full", children: "Cancel" }) })] })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 animate-in slide-in-from-right-4 duration-300", children: [_jsxs("div", { className: "space-y-4", children: [_jsx(Input, { label: `${method} Number`, placeholder: `Enter your ${method}`, value: formData.idNumber, onChange: (e) => setFormData({ ...formData, idNumber: e.target.value }), required: true }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Input, { label: "First Name", placeholder: "As on ID", value: formData.firstName, onChange: (e) => setFormData({ ...formData, firstName: e.target.value }), required: true }), _jsx(Input, { label: "Last Name", placeholder: "As on ID", value: formData.lastName, onChange: (e) => setFormData({ ...formData, lastName: e.target.value }), required: true })] }), _jsx(Input, { label: "Date of Birth", type: "date", value: formData.dob, onChange: (e) => setFormData({ ...formData, dob: e.target.value }), required: true })] }), _jsxs("div", { className: "flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10", children: [_jsx("input", { type: "checkbox", checked: consent, onChange: (e) => setConsent(e.target.checked), className: "mt-1 accent-primary", id: "consent-check" }), _jsx("label", { htmlFor: "consent-check", className: "text-xs text-text-secondary leading-relaxed cursor-pointer select-none", children: "I hereby give consent for Vayva to verify my identity details against official government databases as provided by authorized providers." })] }), error && (_jsxs("div", { className: "p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500 text-sm", children: [_jsx(Icon, { name: "AlertCircle", size: 16 }), error] })), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx(Button, { variant: "ghost", onClick: () => setStep("SELECT"), className: "flex-1", children: "Back" }), _jsx(Button, { type: "submit", isLoading: loading, className: "flex-[2]", children: "Verify Identity" })] })] })), _jsxs("div", { className: "flex items-center justify-center gap-2 pt-4 opacity-50 grayscale hover:grayscale-0 transition-all", children: [_jsx("span", { className: "text-[10px] uppercase font-bold text-text-secondary tracking-widest", children: "Powered by" }), _jsx("img", { src: "/youverify_logo.png", alt: "Youverify", className: "h-4 w-auto" })] })] }));
}
