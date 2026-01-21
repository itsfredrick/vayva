"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@vayva/ui";
import { Switch } from "@/components/ui/switch";
import { Building2, CreditCard, AlertCircle } from "lucide-react";
export default function PaymentsSettingsPage() {
    const [bankTransfers, setBankTransfers] = useState(true);
    const [settlementAccount, setSettlementAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/settings/payments/beneficiaries");
                if (res.ok) {
                    const data = await res.json();
                    setSettlementAccount(data); // null if not set
                }
            }
            catch (e) {
                console.error(e);
            }
            finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);
    return (_jsxs("div", { className: "space-y-6 max-w-4xl", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Payments" }), _jsx("p", { className: "text-slate-500", children: "Manage how you get paid and how customers pay you." })] }), _jsxs("div", { className: "grid gap-6", children: [_jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "p-3 bg-indigo-50 text-indigo-600 rounded-lg", children: _jsx(Building2, { className: "h-6 w-6" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "text-lg font-medium text-slate-900", children: "Settlement Account" }), _jsx(Button, { variant: "link", onClick: () => toast.success("Bank details update requested"), className: "text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline px-0 h-auto", children: settlementAccount ? "Edit" : "Add Account" })] }), _jsx("p", { className: "text-slate-500 text-sm mb-4", children: "Funds from your sales will be settled to this account." }), loading ? (_jsx("div", { className: "h-20 bg-slate-50 rounded-lg animate-pulse" })) : settlementAccount ? (_jsxs("div", { className: "bg-slate-50 rounded-lg border border-slate-100 p-4 max-w-md", children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "text-sm font-medium text-slate-900", children: settlementAccount.bankName }), settlementAccount.isVerified && (_jsx("span", { className: "text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200", children: "VERIFIED" }))] }), _jsx("div", { className: "text-lg font-mono text-slate-700 tracking-wide mb-1", children: settlementAccount.accountNumber }), _jsx("div", { className: "text-sm text-slate-500", children: settlementAccount.accountName })] })) : (_jsxs("div", { className: "bg-amber-50 rounded-lg border border-amber-100 p-4 flex gap-3 text-amber-900", children: [_jsx(AlertCircle, { className: "h-5 w-5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: "No settlement account" }), _jsx("p", { className: "text-xs mt-1", children: "Add a bank account to receive payouts." })] })] }))] })] }) }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "p-3 bg-emerald-50 text-emerald-600 rounded-lg", children: _jsx(CreditCard, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-slate-900", children: "Payment Methods" }), _jsx("p", { className: "text-slate-500 text-sm", children: "Methods available to your customers at checkout." })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border border-slate-100 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-6 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600", children: "CARD" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-slate-900", children: "Debit / Credit Cards" }), _jsx("p", { className: "text-xs text-slate-500", children: "Visa, Mastercard, Verve" })] })] }), _jsx("span", { className: "text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded", children: "ACTIVE" })] }), _jsxs("div", { className: "flex items-center justify-between p-4 border border-slate-100 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-6 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600", children: "XFER" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-slate-900", children: "Bank Transfers" }), _jsx("p", { className: "text-xs text-slate-500", children: "Direct transfer to virtual account" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { htmlFor: "bank-transfers", className: "sr-only", children: "Accept bank transfers" }), _jsx(Switch, { id: "bank-transfers", checked: bankTransfers, onCheckedChange: setBankTransfers })] })] })] })] })] })] }));
}
