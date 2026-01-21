"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Icon, cn } from "@vayva/ui";
import { useAuth } from "@/context/AuthContext";
import { telemetry } from "@/lib/telemetry";
import { INDUSTRY_CONFIG } from "@/config/industry";
import styles from "./DashboardSetupChecklist.module.css";
export function DashboardSetupChecklist() {
    const { merchant } = useAuth();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const [isPersistedHidden, setIsPersistedHidden] = useState(false);
    // Detailed progress state
    const [activation, setActivation] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Persistence check
        if (typeof window !== "undefined") {
            const hidden = localStorage.getItem("vayva_dashboard_setup_hidden") === "true";
            setIsPersistedHidden(hidden);
        }
        async function loadActivation() {
            try {
                const res = await fetch("/api/merchant/dashboard/activation-progress");
                if (res.ok) {
                    const json = await res.json();
                    setActivation(json.data || {});
                }
            }
            catch (e) {
                console.error(e);
            }
            finally {
                setLoading(false);
            }
        }
        loadActivation();
    }, []);
    if (!merchant || loading || !activation)
        return null;
    // Activation Checklist Logic
    // Hide if either onboarding not fully done OR all activation tasks done
    const allDone = activation.hasProducts &&
        activation.hasPayoutMethod &&
        activation.kycStatus === "VERIFIED" &&
        activation.isStoreLive;
    if (allDone)
        return null;
    const handleDismissSession = () => setIsVisible(false);
    const handleHideForever = () => {
        setIsPersistedHidden(true);
        localStorage.setItem("vayva_dashboard_setup_hidden", "true");
    };
    const handleShow = () => {
        setIsVisible(true);
        setIsPersistedHidden(false);
        localStorage.removeItem("vayva_dashboard_setup_hidden");
    };
    // 1) Get Object name from industry
    const industrySlug = activation.industrySlug || "retail";
    const config = INDUSTRY_CONFIG[industrySlug] || INDUSTRY_CONFIG["retail"];
    const primaryObject = config?.primaryObject || "product";
    const objectLabel = primaryObject.charAt(0).toUpperCase() + primaryObject.slice(1).replace(/_/g, " ");
    const items = [
        {
            id: "product",
            label: `Add your first ${objectLabel}`,
            desc: `Create your initial ${primaryObject} listing`,
            isDone: activation.hasProducts,
            path: config?.moduleRoutes?.catalog?.create ||
                `/dashboard/${primaryObject}s/new`.replace("productss", "products"), // Safe plurals
        },
        {
            id: "kyc",
            label: "Verify Identity",
            desc: "Upload ID to enable payouts",
            isDone: activation.kycStatus === "VERIFIED",
            path: "/dashboard/settings/security",
        },
        {
            id: "payments",
            label: "Setup Payout Bank",
            desc: "Where we send your earnings",
            isDone: activation.hasPayoutMethod,
            path: "/dashboard/settings/billing",
        },
        {
            id: "live",
            label: "Go Live",
            desc: "Publish your storefront",
            isDone: activation.isStoreLive,
            path: "/dashboard/control-center",
        },
        {
            id: "roles",
            label: "Secure Team",
            desc: "Define custom roles & permissions",
            isDone: activation.hasCustomRoles,
            path: "/dashboard/settings/roles",
        },
    ];
    // Specific path overrides
    if (primaryObject === "menu_item")
        items[0].path = "/dashboard/menu-items/new";
    if (primaryObject === "digital_asset")
        items[0].path = "/dashboard/digital-assets/new";
    const completedCount = items.filter((i) => i.isDone).length;
    const progressPercent = Math.round((completedCount / items.length) * 100);
    const progressBucket = Math.max(0, Math.min(100, Math.round(progressPercent / 5) * 5));
    const progressClass = styles[`w${progressBucket}`] || styles.w0;
    if (completedCount === items.length)
        return null; // All done
    // Compact Mode (if hidden or dismissed)
    if (!isVisible || isPersistedHidden) {
        return (_jsx("div", { className: "mb-6 flex justify-end", children: _jsxs(Button, { onClick: handleShow, className: "group flex items-center gap-3 text-sm font-bold text-gray-600 bg-white border border-studio-border pl-3 pr-4 py-2 rounded-full hover:border-vayva-green hover:text-black hover:shadow-lg transition-all shadow-sm", variant: "outline", children: [_jsx("div", { className: "relative w-5 h-5", children: _jsxs("svg", { className: "w-full h-full -rotate-90", viewBox: "0 0 36 36", children: [_jsx("path", { className: "text-gray-200", d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831", fill: "none", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "text-vayva-green transition-all duration-500", strokeDasharray: `${progressPercent}, 100`, d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831", fill: "none", stroke: "currentColor", strokeWidth: "4" })] }) }), _jsxs("span", { children: ["Finish Setup (", items.length - completedCount, " left)"] })] }) }));
    }
    return (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 animate-in slide-in-from-top-4 fade-in duration-500", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-lg text-gray-900", children: "Finish your setup" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Complete these steps to get the most out of Vayva." })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("span", { className: "text-sm font-black text-black", children: [progressPercent, "% Done"] }), _jsx(Button, { onClick: handleDismissSession, title: "Dismiss for now", className: "text-gray-400 hover:text-black transition-colors p-1", variant: "ghost", size: "icon", children: _jsx(Icon, { name: "X", size: 20 }) })] })] }), _jsx("div", { className: cn("h-full rounded-full", styles.progressBar, progressClass) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4", children: items.map((item) => (_jsxs("div", { onClick: () => {
                        if (!item.isDone) {
                            telemetry.track("dashboard_checklist_item_clicked", {
                                itemKey: item.id,
                            });
                            router.push(item.path);
                        }
                    }, className: cn("flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 relative group", item.isDone
                        ? "bg-gray-50 border-studio-border opacity-75"
                        : "bg-white border-studio-border hover:border-vayva-green hover:shadow-xl hover:-translate-y-1 cursor-pointer"), children: [_jsx("div", { className: cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", item.isDone
                                ? "bg-green-100 text-green-600"
                                : "bg-studio-gray text-gray-400 group-hover:bg-vayva-green group-hover:text-white transition-all"), children: item.isDone ? (_jsx(Icon, { name: "Check", size: 20 })) : (_jsx(Icon, { name: "ArrowRight", size: 20 })) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: cn("font-bold text-sm", item.isDone ? "text-gray-500 line-through" : "text-gray-900"), children: item.label }), _jsx("p", { className: "text-xs text-gray-500", children: item.desc })] })] }, item.id))) }), _jsx("div", { className: "flex justify-end pt-2 border-t border-gray-100", children: _jsx(Button, { onClick: handleHideForever, className: "text-xs text-gray-400 hover:text-gray-600 hover:underline", variant: "link", children: "Don't show this again" }) })] }));
}
