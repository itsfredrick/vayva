"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Mail, Smartphone, ShoppingBag, Wallet } from "lucide-react";
export default function NotificationsPage() {
    const [preferences, setPreferences] = useState({
        orders_email: true,
        orders_push: true,
        payouts_email: true,
        payouts_push: false,
        security_email: true,
        security_push: true,
        marketing_email: false,
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchPrefs = async () => {
            try {
                const res = await fetch("/api/notifications/preferences");
                if (res.ok) {
                    const data = await res.json();
                    setPreferences(data);
                }
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPrefs();
    }, []);
    const toggle = async (key) => {
        const next = { ...preferences, [key]: !preferences[key] };
        setPreferences(next); // Optimistic update
        try {
            const res = await fetch("/api/notifications/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(next)
            });
            if (!res.ok)
                throw new Error("Failed to save");
            toast.success("Preferences saved");
        }
        catch (error) {
            toast.error("Failed to save preferences");
            setPreferences(preferences); // Revert
        }
    };
    return (_jsxs("div", { className: "space-y-6 max-w-4xl", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Notifications" }), _jsx("p", { className: "text-slate-500", children: "Control how and when we communicate with you." })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100", children: [_jsxs("div", { className: "p-6 flex items-start gap-4", children: [_jsx("div", { className: "p-2 bg-blue-50 text-blue-600 rounded-lg mt-1", children: _jsx(ShoppingBag, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-medium text-slate-900", children: "New Orders" }), _jsx("p", { className: "text-sm text-slate-500 mb-4", children: "Get notified when a customer places an order." }), _jsxs("div", { className: "flex gap-6", children: [_jsx(Toggle, { label: "Email", icon: Mail, checked: preferences.orders_email, onChange: () => toggle('orders_email') }), _jsx(Toggle, { label: "Push", icon: Smartphone, checked: preferences.orders_push, onChange: () => toggle('orders_push') })] })] })] }), _jsxs("div", { className: "p-6 flex items-start gap-4", children: [_jsx("div", { className: "p-2 bg-emerald-50 text-emerald-600 rounded-lg mt-1", children: _jsx(Wallet, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-medium text-slate-900", children: "Payouts" }), _jsx("p", { className: "text-sm text-slate-500 mb-4", children: "Updates on withdrawal requests and deposits." }), _jsxs("div", { className: "flex gap-6", children: [_jsx(Toggle, { label: "Email", icon: Mail, checked: preferences.payouts_email, onChange: () => toggle('payouts_email') }), _jsx(Toggle, { label: "Push", icon: Smartphone, checked: preferences.payouts_push, onChange: () => toggle('payouts_push') })] })] })] }), _jsxs("div", { className: "p-6 flex items-start gap-4", children: [_jsx("div", { className: "p-2 bg-red-50 text-red-600 rounded-lg mt-1", children: _jsx(ShieldAlert, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-medium text-slate-900", children: "Security Alerts" }), _jsx("p", { className: "text-sm text-slate-500 mb-4", children: "Critical security alerts and login attempts." }), _jsxs("div", { className: "flex gap-6", children: [_jsx(Toggle, { label: "Email", icon: Mail, checked: preferences.security_email, onChange: () => toggle('security_email'), disabled: true }), _jsx(Toggle, { label: "Push", icon: Smartphone, checked: preferences.security_push, onChange: () => toggle('security_push'), disabled: true })] }), _jsx("p", { className: "text-xs text-slate-400 mt-2", children: "Security notifications cannot be disabled." })] })] })] })] }));
}
function Toggle({ label, icon: Icon, checked, onChange, disabled }) {
    return (_jsxs("label", { className: `flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`, children: [_jsx("div", { className: `w-10 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`, children: _jsx("div", { className: `bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${checked ? 'translate-x-4' : ''}` }) }), _jsx("input", { type: "checkbox", className: "hidden", checked: checked, onChange: onChange, disabled: disabled }), _jsxs("div", { className: "flex items-center gap-1.5 text-sm font-medium text-slate-700", children: [_jsx(Icon, { className: "h-3.5 w-3.5" }), label] })] }));
}
function ShieldAlert(props) {
    return (_jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" }), _jsx("path", { d: "M12 8v4" }), _jsx("path", { d: "M12 16h.01" })] }));
}
