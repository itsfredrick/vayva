"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Heart, TrendingUp, AlertTriangle, Smile, Meh, Frown } from "lucide-react";
export function MerchantHappinessWidget() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchCSAT();
    }, []);
    const fetchCSAT = async () => {
        try {
            const res = await fetch("/api/ops/analytics/csat");
            const json = await res.json();
            setData(json.data);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading)
        return (_jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-100 animate-pulse h-40", children: [_jsx("div", { className: "h-4 w-32 bg-gray-100 rounded mb-4" }), _jsx("div", { className: "h-8 w-16 bg-gray-100 rounded mb-2" }), _jsx("div", { className: "h-2 w-full bg-gray-100 rounded" })] }));
    if (!data)
        return null;
    const isHighGrowthStandard = data.csatScore >= data.target;
    return (_jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2", children: [_jsx(Heart, { size: 14, className: "text-red-500 fill-red-500" }), "Merchant Happiness"] }), _jsxs("div", { className: "flex items-baseline gap-2 mt-1", children: [_jsxs("span", { className: "text-3xl font-black text-gray-900", children: [data.csatScore, "%"] }), _jsx("span", { className: "text-xs font-semibold text-gray-400", children: "CSAT" })] })] }), isHighGrowthStandard ? (_jsxs("div", { className: "bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1", children: [_jsx(TrendingUp, { size: 12 }), " TARGET MET"] })) : (_jsxs("div", { className: "bg-orange-100 text-orange-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1", children: [_jsx(AlertTriangle, { size: 12 }), " BELOW TARGET"] }))] }), _jsx("div", { className: "h-2 w-full bg-gray-100 rounded-full mb-4 overflow-hidden", children: _jsx("div", { className: `h-full rounded-full transition-all duration-1000 ${isHighGrowthStandard ? 'bg-green-500' : 'bg-orange-500'}`, style: { width: `${data.csatScore}%` } }) }), _jsxs("div", { className: "grid grid-cols-3 gap-2", children: [_jsxs("div", { className: "text-center p-2 rounded-lg bg-gray-50 border border-transparent hover:border-green-200 transition-colors", children: [_jsx(Smile, { size: 16, className: "mx-auto text-green-600 mb-1" }), _jsx("div", { className: "text-xs font-bold text-gray-900", children: data.great }), _jsx("div", { className: "text-[10px] text-gray-500", children: "Great" })] }), _jsxs("div", { className: "text-center p-2 rounded-lg bg-gray-50 border border-transparent hover:border-yellow-200 transition-colors", children: [_jsx(Meh, { size: 16, className: "mx-auto text-yellow-600 mb-1" }), _jsx("div", { className: "text-xs font-bold text-gray-900", children: data.okay }), _jsx("div", { className: "text-[10px] text-gray-500", children: "Okay" })] }), _jsxs("div", { className: "text-center p-2 rounded-lg bg-gray-50 border border-transparent hover:border-red-200 transition-colors", children: [_jsx(Frown, { size: 16, className: "mx-auto text-red-600 mb-1" }), _jsx("div", { className: "text-xs font-bold text-gray-900", children: data.bad }), _jsx("div", { className: "text-[10px] text-gray-500", children: "Poor" })] })] }), _jsxs("div", { className: "mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400", children: [_jsxs("span", { children: ["Based on last ", data.total, " responses"] }), _jsxs("span", { className: "italic", children: ["Goal: ", data.target, "%"] })] })] }));
}
