"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@vayva/ui";
export default function PaymentsSettingsPage() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Payments" }), _jsx("p", { className: "text-muted-foreground", children: "Manage how your store receives payments." })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Payment Methods" }), _jsx(CardDescription, { children: "Configure Paystack or other providers." })] }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "You are currently using Paystack for all transactions." }), _jsx(Button, { variant: "outline", children: "Manage Paystack Account" })] })] })] }));
}
