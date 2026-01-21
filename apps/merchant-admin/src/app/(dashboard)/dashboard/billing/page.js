"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Icon, Button } from "@vayva/ui";
import { formatMoneyNGN } from "@/lib/billing/formatters";
import { PLANS } from "@/lib/billing/plans";
export default function BillingPage() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null); // plan slug
    useEffect(() => {
        fetch("/api/merchant/billing/status")
            .then((res) => res.json())
            .then((data) => {
            setStatus(data);
            setLoading(false);
        });
    }, []);
    const handleSubscribe = async (slug) => {
        setProcessing(slug);
        try {
            const res = await fetch("/api/merchant/billing/subscribe", {
                method: "POST",
                body: JSON.stringify({ plan_slug: slug }),
            });
            const data = await res.json();
            if (data.checkout_url) {
                window.location.href = data.checkout_url; // Redirect to payment
            }
        }
        catch (e) {
            alert("Error");
            setProcessing(null);
        }
    };
    if (loading)
        return _jsx("div", { className: "p-8", children: "Loading billing..." });
    const currentPlan = status?.planKey || "none";
    const isPastDue = status?.status === "past_due";
    return (_jsxs("div", { className: "max-w-5xl mx-auto py-12 px-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Billing & Plans" }), isPastDue && (_jsxs("div", { className: "bg-red-50 border border-red-100 p-4 rounded-xl mb-8 flex items-center gap-4", children: [_jsx(Icon, { name: "AlertOctagon", className: "text-red-500" }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-bold text-red-900", children: "Payment Failed" }), _jsx("p", { className: "text-sm text-red-700", children: "Your subscription is past due. Pro features are restricted." })] })] })), _jsxs("div", { className: "bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-12 flex items-start gap-4", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400", children: _jsx(Icon, { name: "Info", size: 20 }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-gray-900", children: "Transaction Disclosure" }), _jsx("p", { className: "text-sm text-gray-500", children: "A 3% transaction fee is applied to every withdrawal from your Vayva wallet to your bank account, regardless of your plan tier." })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-12", children: [PLANS.starter, PLANS.pro].map((plan) => {
                    const isCurrent = currentPlan === plan.slug;
                    return (_jsxs("div", { className: `border rounded-2xl p-8 relative ${isCurrent
                            ? "border-black ring-1 ring-black bg-gray-50"
                            : "border-gray-200 bg-white"}`, children: [isCurrent && (_jsx("div", { className: "absolute top-4 right-4 bg-black text-white text-xs px-2 py-1 rounded font-bold uppercase", children: "Current Plan" })), _jsx("h3", { className: "text-xl font-bold mb-1", children: plan.name }), _jsxs("div", { className: "text-3xl font-bold mb-4", children: [formatMoneyNGN(plan.priceNgn), _jsx("span", { className: "text-sm font-normal text-gray-500", children: "/mo" }), _jsxs("div", { className: "text-xs text-blue-600 mt-1 font-medium italic", children: ["+ 7.5% VAT (", formatMoneyNGN(Math.round(plan.priceNgn * 0.075)), ")"] })] }), _jsxs("ul", { className: "space-y-3 mb-8 text-sm text-gray-600", children: [_jsxs("li", { className: "flex gap-2", children: [_jsx(Icon, { name: "Check", size: 16 }), " ", plan.limits.teamSeats, " Team Seat(s)"] }), _jsxs("li", { className: "flex gap-2", children: [_jsx(Icon, { name: "Check", size: 16 }), " Campaign Limit:", " ", plan.limits.monthlyCampaignSends] }), _jsxs("li", { className: "flex gap-2", children: [_jsx(Icon, { name: "Check", size: 16 }), " ", plan.features.approvals
                                                ? "Approvals Included"
                                                : "Basic Tools"] })] }), _jsx(Button, { onClick: () => handleSubscribe(plan.slug), disabled: isCurrent || !!processing, className: `w-full py-6 rounded-lg font-bold shadow-none ${isCurrent
                                    ? "bg-gray-200 text-gray-500 cursor-default hover:bg-gray-200"
                                    : "bg-black text-white hover:bg-gray-800"}`, children: isCurrent
                                    ? "Active"
                                    : processing === plan.slug
                                        ? "Processing..."
                                        : `Switch to ${plan.name}` })] }, plan.slug));
                }) }), _jsx("h2", { className: "text-xl font-bold mb-4", children: "Invoice History" }), _jsx("div", { className: "bg-white border rounded-xl overflow-hidden", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 font-bold text-gray-500", children: "Date" }), _jsx("th", { className: "px-6 py-3 font-bold text-gray-500", children: "Amount" }), _jsx("th", { className: "px-6 py-3 font-bold text-gray-500", children: "Status" }), _jsx("th", { className: "px-6 py-3 font-bold text-gray-500" })] }) }), _jsx("tbody", { className: "divide-y", children: status?.invoices?.length > 0 ? (status.invoices.map((inv) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4", children: new Date(inv.issuedAt).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4", children: formatMoneyNGN(inv.amountNgn) }), _jsx("td", { className: "px-6 py-4 capitalize", children: inv.status }), _jsx("td", { className: "px-6 py-4 text-right", children: "Download" })] }, inv.id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-6 py-8 text-center text-gray-400", children: "No invoices yet" }) })) })] }) })] }));
}
