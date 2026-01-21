"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, Suspense } from "react";
import { Button } from "@vayva/ui";
import { useSearchParams, useRouter } from "next/navigation";
function PaystackTestContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reference = searchParams.get("reference");
    const amount = searchParams.get("amount");
    const [loading, setLoading] = useState(false);
    const handleSimulate = async (status) => {
        setLoading(true);
        // Simulate webhook call to backend (Gateway -> Payments Service)
        try {
            if (status === "success") {
                const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/v1$/, "");
                await fetch(`${apiBase}/webhooks/paystack`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        event: "charge.success",
                        data: {
                            reference,
                            status: "success",
                            amount: Number(amount),
                            id: Math.floor(Math.random() * 1000000000),
                        },
                    }),
                });
            }
        }
        catch (e) {
            console.error("Webhook simulation failed", e);
        }
        // Redirect back to confirmation
        router.push(`/order/confirmation?reference=${reference}&store=demo`);
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans", children: _jsxs("div", { className: "bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden", children: [_jsxs("div", { className: "bg-[#011b33] p-8 text-white flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold italic tracking-tighter", children: "paystack" }), _jsx("p", { className: "text-[10px] opacity-70 uppercase tracking-widest mt-1", children: "Checkout Simulation" })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-xs opacity-70", children: "Pay" }), _jsxs("p", { className: "text-xl font-bold", children: ["\u20A6", (Number(amount) / 100).toLocaleString()] })] })] }), _jsxs("div", { className: "p-10 space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx("span", { className: "text-2xl font-bold", children: "P" }) }), _jsx("h2", { className: "text-lg font-bold", children: "Transaction Reference" }), _jsx("code", { className: "bg-gray-100 px-3 py-1 rounded text-sm text-gray-600 mt-2 inline-block font-mono", children: reference || "N/A" })] }), _jsxs("div", { className: "space-y-3", children: [_jsx(Button, { onClick: () => handleSimulate("success"), disabled: loading, className: "w-full bg-[#3bb75e] text-white py-4 rounded-lg font-bold hover:bg-[#34a353] transition-colors disabled:opacity-50", children: loading ? "Processing..." : "Simulate Successful Payment" }), _jsx(Button, { onClick: () => handleSimulate("failed"), disabled: loading, className: "w-full bg-white text-red-500 border border-red-100 py-4 rounded-lg font-bold hover:bg-red-50 transition-colors disabled:opacity-50", children: "Simulate Payment Failure" })] }), _jsxs("p", { className: "text-[10px] text-gray-400 text-center uppercase tracking-widest leading-loose", children: ["Securely processed by Paystack Test", _jsx("br", {}), "This is a simulated environment"] })] })] }) }));
}
export default function PaystackTestClient() {
    return (_jsx(Suspense, { fallback: _jsx("div", { children: "Loading simulation..." }), children: _jsx(PaystackTestContent, {}) }));
}
