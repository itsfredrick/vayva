"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Input, Icon } from "@vayva/ui";
import Link from "next/link";
import { VayvaLogo } from "@/components/VayvaLogo";
import { motion } from "framer-motion";
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsSubmitted(true);
    };
    return (_jsxs("div", { className: "min-h-screen bg-white flex flex-col pt-16 items-center", children: [_jsx(Link, { href: "/", className: "mb-12", children: _jsx(VayvaLogo, { className: "h-8" }) }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "w-full max-w-md p-6", children: [!isSubmitted ? (_jsxs(_Fragment, { children: [_jsx("h1", { className: "text-3xl font-bold mb-2", children: "Reset Password" }), _jsx("p", { className: "text-gray-500 mb-8", children: "Enter your email to receive recovery instructions." }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }), _jsx(Input, { type: "email", required: true, placeholder: "you@example.com", value: email, onChange: (e) => setEmail(e.target.value), className: "h-12" })] }), _jsx(Button, { type: "submit", className: "w-full h-12 text-base", disabled: isLoading, children: isLoading ? "Sending..." : "Send Reset Link" })] })] })) : (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600", children: _jsx(Icon, { name: "Check", size: 32 }) }), _jsx("h2", { className: "text-2xl font-bold mb-2", children: "Check your email" }), _jsxs("p", { className: "text-gray-500 mb-8", children: ["We've sent password reset instructions to ", _jsx("strong", { children: email }), "."] }), _jsx(Button, { variant: "outline", className: "w-full", onClick: () => setIsSubmitted(false), children: "Use different email" })] })), _jsx("div", { className: "mt-8 text-center", children: _jsx(Link, { href: "/signin", className: "text-sm font-bold text-gray-900 hover:underline", children: "Back to Sign In" }) })] })] }));
}
