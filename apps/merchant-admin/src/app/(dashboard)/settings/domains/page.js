"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Input } from "@vayva/ui";
export default function DomainsSettingsPage() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Domains" }), _jsx("p", { className: "text-muted-foreground", children: "Manage your custom storefront domains." })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Connected Domains" }), _jsx(CardDescription, { children: "Add a custom domain for your storefront." })] }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { placeholder: "myshop.com" }), _jsx(Button, { children: "Connect" })] }) })] })] }));
}
