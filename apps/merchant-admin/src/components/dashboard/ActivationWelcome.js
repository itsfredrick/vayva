"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button, Icon } from "@vayva/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { telemetry } from "@/lib/telemetry";
export function ActivationWelcome() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isWelcome = searchParams.get("welcome") === "true";
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        // 1. Activate mode if query param present
        if (isWelcome) {
            localStorage.setItem("activation_mode", "true");
        }
        // 2. Check persistence and session state
        const isActive = localStorage.getItem("activation_mode") === "true";
        const persistentDismissed = localStorage.getItem("activation_welcome_dismissed");
        const sessionDismissed = sessionStorage.getItem("activation_welcome_dismissed_session");
        // 3. Determine visibility & Track
        // Show if active AND not dismissed (persistent or session)
        // OR override if explicitly welcome=true (unless persistent dismissed? prompt says 'welcome' triggers it)
        // We allow 'welcome=true' to show it even if previously dismissed, to allow recall.
        if (isWelcome || (isActive && !persistentDismissed && !sessionDismissed)) {
            setVisible(true);
            // Track only once per session view to avoid noise?
            // The prompt asks for 'activation_welcome_shown'.
            // unique-per-session tracking is handled by the useEffect generally running once on mount.
            telemetry.track("activation_welcome_shown");
        }
    }, [isWelcome]);
    if (!visible)
        return null;
    const handleDismiss = () => {
        setVisible(false);
        localStorage.setItem("activation_welcome_dismissed", "true");
    };
    const handleAction = async (action, path) => {
        telemetry.track("activation_quick_action_clicked", { actionKey: action });
        if (action === "create_order") {
            try {
                // Create test order via API
                await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        mode: "test",
                        total: 5000,
                        subtotal: 4500,
                        shipping: 500,
                    }),
                });
                // Navigate to orders list to see it
                router.push("/dashboard/orders");
            }
            catch (e) {
                console.error("Failed to create test order", e);
                // Navigate anyway
                router.push(path);
            }
        }
        else {
            router.push(path);
        }
    };
    // Fetch user name
    const [firstName, setFirstName] = useState("Merchant");
    useEffect(() => {
        fetch("/api/auth/merchant/me")
            .then(res => res.json())
            .then(data => {
            if (data.user?.name)
                setFirstName(data.user.name.split(" ")[0]);
        })
            .catch(() => { });
    }, []);
    if (!visible)
        return null;
    return (_jsxs("div", { className: "bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 md:p-8 mb-8 text-white relative overflow-hidden shadow-2xl animate-in slide-in-from-top-4 fade-in duration-700", children: [_jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" }), _jsx("div", { className: "absolute top-4 right-4 flex items-center gap-4 z-20", children: _jsx(Button, { onClick: () => {
                        setVisible(false);
                        localStorage.setItem("activation_welcome_dismissed", "true");
                    }, className: "text-white/40 hover:text-white/70 text-xs transition-colors", children: "Dismiss" }) }), _jsxs("div", { className: "relative z-10 grid md:grid-cols-2 gap-8 items-center", children: [_jsxs("div", { children: [_jsx("div", { className: "flex items-center gap-3 mb-4", children: _jsx("span", { className: "bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse", children: "Live & Ready" }) }), _jsxs("h2", { className: "text-2xl md:text-3xl font-bold mb-3", children: ["Welcome to Vayva, ", firstName, "!"] }), _jsx("p", { className: "text-gray-400 text-lg mb-6 leading-relaxed", children: "Your store is live. Complete these 3 steps in your first 24 hours to launch successfully." }), _jsx("div", { className: "flex flex-wrap gap-3", children: _jsx(Button, { onClick: () => handleAction("add_product", "/dashboard/products"), size: "lg", className: "bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10", children: "Add First Product \u2192" }) })] }), _jsxs("div", { className: "bg-white/10 border border-white/10 rounded-xl p-6 backdrop-blur-sm", children: [_jsxs("h3", { className: "font-bold text-gray-200 mb-4 flex items-center gap-2", children: [_jsx(Icon, { name: "ListChecks", size: 18 }), "Go-Live Checklist"] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { onClick: () => handleAction("whatsapp", "/onboarding/communication"), className: "flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group", children: [_jsx("div", { className: "w-5 h-5 rounded-full border-2 border-white/20 group-hover:border-green-400 transition-colors" }), _jsx("span", { className: "text-gray-300 group-hover:text-white transition-colors", children: "Share your store on WhatsApp" }), _jsx(Icon, { name: "ArrowRight", size: 14, className: "ml-auto opacity-0 group-hover:opacity-100 text-white/50" })] }), _jsxs("div", { onClick: () => handleAction("test_order", "/dashboard/orders"), className: "flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group", children: [_jsx("div", { className: "w-5 h-5 rounded-full border-2 border-white/20 group-hover:border-purple-400 transition-colors" }), _jsx("span", { className: "text-gray-300 group-hover:text-white transition-colors", children: "Place a test order" }), _jsx(Icon, { name: "ArrowRight", size: 14, className: "ml-auto opacity-0 group-hover:opacity-100 text-white/50" })] }), _jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg opacity-60 cursor-default", children: [_jsx("div", { className: "w-5 h-5 rounded-full border-2 border-dashed border-white/20" }), _jsx("span", { className: "text-gray-400", children: "Complete your first sale" })] })] })] })] })] }));
}
