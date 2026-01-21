"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button, Card, Icon } from "@vayva/ui";
export default function ReferralsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        fetch("/api/referrals")
            .then((res) => res.json())
            .then((d) => {
            setData(d);
            setLoading(false);
        });
    }, []);
    const copyCode = () => {
        if (!data?.code)
            return;
        navigator.clipboard.writeText(data.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    if (loading)
        return (_jsx("div", { className: "p-8", children: _jsx(Icon, { name: "Loader", className: "animate-spin" }) }));
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6 space-y-8", children: [_jsxs("header", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-xl overflow-hidden relative", children: [_jsxs("div", { className: "relative z-10", children: [_jsx("h1", { className: "text-3xl font-bold mb-2", children: "Refer & Earn \u20A61,000" }), _jsx("p", { className: "text-indigo-100 max-w-md", children: "Refer another business to Vayva. Once they subscribe, you get \u20A61,000 off your next bill. Capped at 6 referrals per month." })] }), _jsxs("div", { className: "bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 relative z-10", children: [_jsx("p", { className: "text-xs uppercase tracking-widest text-indigo-200 font-bold mb-3", children: "Your Referral Code" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("code", { className: "text-2xl font-mono font-bold", children: data?.code }), _jsx(Button, { onClick: copyCode, className: "p-2 hover:bg-white/10 rounded-lg transition-colors", children: _jsx(Icon, { name: copied ? "Check" : "Copy", size: 20 }) })] })] }), _jsx(Icon, { name: "Users", className: "absolute -bottom-10 -right-10 w-64 h-64 text-white/5" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "p-6 flex flex-col items-center text-center", children: [_jsx("div", { className: "w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4", children: _jsx(Icon, { name: "UserPlus" }) }), _jsx("p", { className: "text-sm text-gray-500 uppercase font-bold tracking-wider", children: "Total Referrals" }), _jsx("h2", { className: "text-3xl font-bold mt-1", children: data?.stats?.total || 0 })] }), _jsxs(Card, { className: "p-6 flex flex-col items-center text-center", children: [_jsx("div", { className: "w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4", children: _jsx(Icon, { name: "CreditCard" }) }), _jsx("p", { className: "text-sm text-gray-500 uppercase font-bold tracking-wider", children: "Converted" }), _jsx("h2", { className: "text-3xl font-bold mt-1", children: data?.stats?.conversions || 0 })] }), _jsxs(Card, { className: "p-6 flex flex-col items-center text-center", children: [_jsx("div", { className: "w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4", children: _jsx(Icon, { name: "Gift" }) }), _jsx("p", { className: "text-sm text-gray-500 uppercase font-bold tracking-wider", children: "Next Discount" }), _jsxs("h2", { className: "text-3xl font-bold mt-1", children: ["\u20A6", data?.pendingDiscount?.toLocaleString() || 0] })] })] }), _jsxs("div", { className: "bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden", children: [_jsxs("div", { className: "p-6 border-b border-gray-50 flex items-center justify-between", children: [_jsx("h3", { className: "font-bold text-gray-900", children: "Reward History" }), _jsx(Icon, { name: "History", className: "text-gray-300" })] }), data?.rewards?.length > 0 ? (_jsx("div", { className: "divide-y divide-gray-50", children: data.rewards.map((reward) => (_jsxs("div", { className: "p-6 flex items-center justify-between hover:bg-gray-50 transition-colors", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold text-gray-900", children: reward.description }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: new Date(reward.createdAt).toLocaleDateString() })] }), _jsxs("div", { className: "text-green-600 font-bold", children: ["+\u20A6", reward.amount?.toLocaleString()] })] }, reward.id))) })) : (_jsx("div", { className: "p-12 text-center text-gray-400", children: _jsx("p", { children: "No rewards earned yet. Share your code to start saving!" }) }))] })] }));
}
