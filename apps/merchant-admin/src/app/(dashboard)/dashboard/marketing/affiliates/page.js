"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Copy, Gift, Users, TrendingUp, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@vayva/ui";
export default function AffiliatesPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const res = await fetch("/api/marketing/affiliates");
            if (!res.ok)
                throw new Error("Failed to load data");
            const result = await res.json();
            setData(result.data);
        }
        catch (error) {
            console.error(error);
            toast.error("Could not load affiliate program data");
        }
        finally {
            setLoading(false);
        }
    };
    const copyCode = () => {
        if (data?.referralCode) {
            navigator.clipboard.writeText(data.referralCode);
            toast.success("Referral code copied!");
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex h-96 items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin text-indigo-600" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Affiliate Program" }), _jsx("p", { className: "text-slate-500", children: "Refer other merchants to Vayva and earn credits." })] }), _jsxs("div", { className: "bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 p-8 opacity-10", children: _jsx(Gift, { className: "h-64 w-64" }) }), _jsxs("div", { className: "relative z-10", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "Share the love, earn rewards" }), _jsxs("p", { className: "text-indigo-100 mb-6 max-w-lg", children: ["Get ", data?.stats.commissionRate, " for every merchant who signs up with your code and processes their first payment."] }), _jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-4", children: [_jsxs("div", { className: "bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 flex items-center gap-3", children: [_jsx("span", { className: "font-mono text-lg tracking-wider font-bold", children: data?.referralCode || "Loading..." }), _jsx(Button, { onClick: copyCode, variant: "ghost", size: "icon", className: "text-white/80 hover:text-white hover:bg-white/10 h-8 w-8 rounded-full", title: "Copy Code", children: _jsx(Copy, { className: "h-4 w-4" }) })] }), _jsx(Button, { onClick: copyCode, className: "bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 font-medium shadow-sm border-transparent", children: "Copy Invitation Link" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-slate-200", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 bg-emerald-50 text-emerald-600 rounded-lg", children: _jsx(TrendingUp, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-500 font-medium", children: "Total Earned" }), _jsx("p", { className: "text-2xl font-bold text-slate-900", children: formatCurrency(data?.stats.totalEarned || 0) })] })] }) }), _jsx("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-slate-200", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 bg-blue-50 text-blue-600 rounded-lg", children: _jsx(Users, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-500 font-medium", children: "Successful Referrals" }), _jsx("p", { className: "text-2xl font-bold text-slate-900", children: data?.stats.totalReferrals || 0 })] })] }) })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: [_jsx("div", { className: "p-6 border-b border-slate-100", children: _jsx("h3", { className: "font-semibold text-slate-900", children: "Reward History" }) }), !data?.history.length ? (_jsxs("div", { className: "p-12 text-center flex flex-col items-center", children: [_jsx("div", { className: "h-12 w-12 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center mb-4", children: _jsx(Gift, { className: "h-6 w-6" }) }), _jsx("p", { className: "text-slate-500", children: "No rewards earned yet. Start referring!" })] })) : (_jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-slate-50 text-slate-600 font-medium border-b border-slate-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "Date" }), _jsx("th", { className: "px-6 py-3", children: "Description" }), _jsx("th", { className: "px-6 py-3 text-right", children: "Amount" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100", children: data.history.map((reward) => (_jsxs("tr", { className: "hover:bg-slate-50/50", children: [_jsx("td", { className: "px-6 py-4 text-slate-500", children: formatDate(reward.date) }), _jsx("td", { className: "px-6 py-4 font-medium text-slate-900", children: reward.description }), _jsxs("td", { className: "px-6 py-4 text-right text-emerald-600 font-medium", children: ["+", formatCurrency(reward.amount)] })] }, reward.id))) })] }))] })] }));
}
