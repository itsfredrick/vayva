"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { CreditCard } from "lucide-react";
export default function BillingPage() {
    return (_jsxs("div", { className: "flex h-[60vh] flex-col items-center justify-center p-8 text-center text-gray-500", children: [_jsx("div", { className: "bg-gray-100 p-4 rounded-full mb-4", children: _jsx(CreditCard, { className: "h-8 w-8 text-gray-400" }) }), _jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Billing & Plans" }), _jsx("p", { className: "max-w-md mt-2 mb-6", children: "Manage your subscription, view invoices, and update payment methods. This module is currently under maintenance." }), _jsx(Button, { children: "Contact Support" })] }));
}
