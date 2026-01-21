"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { Button, GlassPanel, Input } from "@vayva/ui";
export default function AcceptInvitePage({ params, }) {
    // Test logic: token 'valid' shows form, 'invalid' shows error
    const { token } = React.use(params);
    const isValid = token !== "invalid";
    return (_jsx(AuthShell, { children: _jsx(GlassPanel, { className: "w-full max-w-[500px] p-10 flex flex-col gap-8", children: isValid ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-white mb-2", children: "Join Amina Beauty Store" }), _jsxs("p", { className: "text-text-secondary", children: ["You've been invited as", " ", _jsx("span", { className: "text-primary font-bold", children: "Admin" })] })] }), _jsxs("form", { className: "flex flex-col gap-5", children: [_jsx(Input, { label: "Full Name", placeholder: "Your Name" }), _jsx(Input, { label: "Create Password", type: "password" }), _jsx(Input, { label: "Confirm Password", type: "password" }), _jsx(Button, { children: "Accept Invite" })] }), _jsx("div", { className: "text-center border-t border-border-subtle pt-4", children: _jsxs("p", { className: "text-xs text-text-secondary", children: ["Already have an account?", " ", _jsx(Link, { href: "/signin", className: "text-white hover:underline", children: "Log in" }), " ", "instead."] }) })] })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx("h2", { className: "text-xl font-bold text-state-danger mb-2", children: "Invite Expired" }), _jsx("p", { className: "text-text-secondary mb-6", children: "This invitation link has expired or is invalid." }), _jsx(Link, { href: "/signin", children: _jsx(Button, { variant: "outline", children: "Go to Login" }) })] })) }) }));
}
