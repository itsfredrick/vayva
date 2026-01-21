"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import { Loader2, ArrowUpRight, ArrowDownLeft, RefreshCcw } from "lucide-react";
import { Button } from "@vayva/ui";
export default function TransactionsPage() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    useEffect(() => {
        fetchTransactions();
    }, []);
    const fetchTransactions = async () => {
        try {
            const res = await fetch("/api/finance/transactions?limit=50");
            if (!res.ok)
                throw new Error("Failed to load transactions");
            const data = await res.json();
            setTransactions(data.data || []);
        }
        catch (error) {
            console.error(error);
            toast.error("Could not load transaction history");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Transactions" }), _jsx("p", { className: "text-slate-500", children: "Real-time ledger of all payments and refunds." })] }), _jsx(Button, { onClick: fetchTransactions, disabled: loading, variant: "outline", size: "icon", className: "h-9 w-9 text-slate-500 hover:text-slate-700 bg-white border-slate-200 hover:bg-slate-50", title: "Refresh", children: _jsx(RefreshCcw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }) })] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: loading && transactions.length === 0 ? (_jsx("div", { className: "p-12 flex justify-center", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-slate-400" }) })) : transactions.length === 0 ? (_jsx("div", { className: "p-12 text-center text-slate-500", children: _jsx("p", { className: "mb-2", children: "No transactions recorded yet." }) })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-slate-50 text-slate-600 font-medium border-b border-slate-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "Date" }), _jsx("th", { className: "px-6 py-3", children: "Type" }), _jsx("th", { className: "px-6 py-3", children: "Reference" }), _jsx("th", { className: "px-6 py-3", children: "Amount" }), _jsx("th", { className: "px-6 py-3", children: "Status" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100", children: transactions.map((tx) => (_jsxs("tr", { className: "hover:bg-slate-50/50", children: [_jsxs("td", { className: "px-6 py-4 text-slate-900 whitespace-nowrap", children: [new Date(tx.date).toLocaleDateString(), _jsx("span", { className: "text-slate-400 text-xs ml-2", children: new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })] }), _jsx("td", { className: "px-6 py-4", children: _jsx(TypeBadge, { type: tx.type }) }), _jsx("td", { className: "px-6 py-4 font-mono text-slate-500", children: tx.reference }), _jsx("td", { className: "px-6 py-4 font-medium text-slate-900", children: formatCurrency(tx.amount, tx.currency) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex px-2 py-1 rounded-full text-xs font-medium ${tx.status === "SUCCESS" ? "bg-emerald-100 text-emerald-700" :
                                                    tx.status === "FAILED" ? "bg-red-100 text-red-700" :
                                                        "bg-amber-100 text-amber-700"}`, children: tx.status }) })] }, tx.id))) })] }) })) })] }));
}
function TypeBadge({ type }) {
    if (type === "CHARGE") {
        return (_jsxs("span", { className: "inline-flex items-center gap-1.5 text-slate-700", children: [_jsx("div", { className: "p-1 bg-emerald-100 text-emerald-600 rounded", children: _jsx(ArrowDownLeft, { className: "h-3 w-3" }) }), "Sale"] }));
    }
    if (type === "REFUND") {
        return (_jsxs("span", { className: "inline-flex items-center gap-1.5 text-slate-700", children: [_jsx("div", { className: "p-1 bg-red-100 text-red-600 rounded", children: _jsx(ArrowUpRight, { className: "h-3 w-3" }) }), "Refund"] }));
    }
    return _jsx("span", { className: "text-slate-600", children: type });
}
