"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Card, Icon } from "@vayva/ui";
import { PLANS, formatNGN } from "@/config/pricing";
import { toast } from "sonner";
export default function TrialExpiredPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({ products: 0, leads: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(null);
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/billing/subscription");
                const data = await res.json();
                // Simulating stat fetch if not in subscription API
                setStats({
                    products: data.usage?.products || 0,
                    leads: data.usage?.leads || 0,
                });
            }
            catch (error) {
                console.error("Failed to fetch trial stats", error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);
    const handleUpgrade = async (planKey) => {
        setIsProcessing(planKey);
        try {
            const res = await fetch("/api/billing/subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPlan: planKey.toUpperCase() }),
            });
            const data = await res.json();
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            }
            else {
                toast.error("Failed to initiate upgrade");
            }
        }
        catch (error) {
            toast.error("Error processing upgrade");
        }
        finally {
            setIsProcessing(null);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6", children: _jsxs("div", { className: "max-w-4xl w-full space-y-12 text-center", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4", children: _jsx(Icon, { name: "Lock", size: 40, className: "text-orange-600" }) }), _jsx("h1", { className: "text-4xl font-extrabold text-gray-900 tracking-tight", children: "Your trial has ended, but your progress is safe. \uD83D\uDEE1\uFE0F" }), _jsx("p", { className: "text-xl text-gray-500 max-w-2xl mx-auto", children: "Your store is currently paused. Upgrade now to keep your business live and continue growing." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto", children: [_jsx(Card, { className: "p-6 bg-white border-2 border-gray-100 hover:border-black transition-all", children: _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("span", { className: "text-3xl font-bold text-black", children: isLoading ? "..." : stats.products }), _jsx("span", { className: "text-sm font-bold uppercase tracking-wider text-gray-400", children: "Products Online" })] }) }), _jsx(Card, { className: "p-6 bg-white border-2 border-gray-100 hover:border-black transition-all", children: _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("span", { className: "text-3xl font-bold text-black", children: isLoading ? "..." : stats.leads }), _jsx("span", { className: "text-sm font-bold uppercase tracking-wider text-gray-400", children: "Leads Waiting \u23F3" })] }) })] }), _jsx("div", { className: "bg-blue-50 border border-blue-100 p-4 rounded-xl max-w-md mx-auto", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Scarcity Alert:" }), " Your customer leads are currently on hold and will be released immediately upon payment."] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mt-12", children: PLANS.filter(p => p.key !== 'STARTER').map((plan) => (_jsxs(Card, { className: `p-8 bg-white flex flex-col relative ${plan.key === 'PRO' ? 'border-2 border-black scale-105 z-10' : 'border border-gray-200'}`, children: [plan.key === 'PRO' && (_jsx("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg", children: "Best for Growth & Team" })), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: plan.name }), _jsx("p", { className: "text-gray-500 text-sm h-10", children: plan.tagline })] }), _jsxs("div", { className: "flex items-baseline gap-1 mb-8", children: [_jsx("span", { className: "text-4xl font-extrabold text-black", children: formatNGN(plan.monthlyAmount) }), _jsx("span", { className: "text-gray-400 font-medium", children: "/month" })] }), _jsxs("ul", { className: "space-y-4 mb-10 text-left flex-grow", children: [plan.bullets.map((bullet, i) => (_jsxs("li", { className: "flex items-start gap-3 text-sm text-gray-600", children: [_jsx(Icon, { name: "CheckCircle2", size: 18, className: "text-green-500 flex-shrink-0 mt-0.5" }), _jsx("span", { children: bullet })] }, i))), plan.key === 'PRO' && (_jsxs("li", { className: "flex items-start gap-3 text-sm text-black font-bold", children: [_jsx(Icon, { name: "Sparkles", size: 18, className: "text-orange-500 flex-shrink-0 mt-0.5" }), _jsx("span", { children: "Includes Vayva Cut Pro" })] }))] }), _jsx(Button, { className: `w-full h-14 text-lg font-bold rounded-xl transition-transform active:scale-95 ${plan.key === 'PRO' ? 'bg-black text-white hover:bg-gray-900 shadow-xl' : 'bg-white text-black border-2 border-gray-200 hover:border-black'}`, onClick: () => handleUpgrade(plan.key), isLoading: isProcessing === plan.key, children: "Pay Now & Unlock" })] }, plan.key))) }), _jsx("div", { className: "pt-12", children: _jsx("p", { className: "text-gray-400 text-sm", children: "Secure payment via Paystack. Your data is encrypted and safe." }) })] }) }));
}
