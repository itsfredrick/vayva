"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Link from "next/link";
import { AuthService } from "@/services/auth";
import { SplitAuthLayout } from "@/components/auth/SplitAuthLayout";
import { Button } from "@vayva/ui";
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await AuthService.forgotPassword({ email });
            setSuccess(true);
        }
        catch (err) {
            console.error(err);
            setError(err.message || "Failed to send reset instructions");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(SplitAuthLayout, { title: "Reset your password", subtitle: "Enter your email and we'll send you instructions.", showSignInLink: true, children: success ? (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "p-4 bg-green-50 border border-green-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("svg", { className: "w-5 h-5 text-green-600 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-green-900 mb-1", children: "Check your email" }), _jsxs("p", { className: "text-sm text-green-700", children: ["We've sent password reset instructions to", " ", _jsx("strong", { children: email }), ". Please check your inbox and follow the link to reset your password."] })] })] }) }), _jsx("div", { className: "text-center", children: _jsx(Link, { href: "/signin", className: "text-sm text-gray-700 hover:text-black font-medium transition-colors", children: "\u2190 Back to sign in" }) })] })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [error && (_jsx("div", { className: "p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg", children: error })), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-900 mb-2", children: "Email address" }), _jsx("input", { id: "email", type: "email", placeholder: "you@business.com", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full h-12 px-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent" })] }), _jsx(Button, { type: "submit", disabled: loading, className: "w-full h-12 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? "Sending instructions..." : "Send reset instructions" }), _jsx("div", { className: "text-center", children: _jsx(Link, { href: "/signin", className: "text-sm text-gray-700 hover:text-black font-medium transition-colors", children: "\u2190 Back to sign in" }) })] })) }));
}
