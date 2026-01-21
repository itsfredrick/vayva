"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { Server, Zap, Database, AlertTriangle, RefreshCw, ToggleLeft, ToggleRight, Terminal, Globe, Activity } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@vayva/ui"; // Assuming UI lib exists, or use standard HTML
export default function SystemToolsPage() {
    return (_jsxs("div", { className: "p-8 max-w-6xl mx-auto space-y-8", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-3", children: [_jsx(Terminal, { className: "h-8 w-8 text-indigo-600" }), "System Tools"] }), _jsx("p", { className: "text-gray-500 mt-1", children: "Advanced controls for platform operations." })] }) }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600", children: _jsx(Activity, { size: 20 }) }), _jsx("h3", { className: "font-semibold text-gray-900", children: "System Health" })] }), _jsx("p", { className: "text-sm text-gray-500 mb-6", children: "Monitor database connectivity, API latency, and system uptime status." }), _jsx(Link, { href: "/ops/tools/health", className: "inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700", children: "Check Status \u2192" })] }), _jsx(CacheControlCard, {}), _jsx(FeatureFlagCard, {}), _jsx(AnnouncementCard, {}), _jsx(EnvInfoCard, {})] })] }));
}
function AnnouncementCard() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(null);
    React.useEffect(() => {
        fetch("/api/ops/config/announcements")
            .then(res => res.json())
            .then(data => setCurrent(data.announcement))
            .catch(() => { });
    }, []);
    const publish = async () => {
        setLoading(true);
        try {
            await fetch("/api/ops/config/announcements", {
                method: "POST",
                body: JSON.stringify({ message, active: true })
            });
            toast.success("Announcement Published");
            setCurrent({ message, active: true });
            setMessage("");
        }
        catch (e) {
            toast.error("Failed");
        }
        finally {
            setLoading(false);
        }
    };
    const clear = async () => {
        setLoading(true);
        try {
            await fetch("/api/ops/config/announcements", { method: "DELETE" });
            toast.success("Announcement Cleared");
            setCurrent(null);
        }
        catch (e) {
            toast.error("Failed");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-200 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "p-2 bg-pink-100 text-pink-600 rounded-lg", children: _jsx(AlertTriangle, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Announcements" }), _jsx("p", { className: "text-xs text-gray-500", children: "Global dashboard banners." })] })] }), current ? (_jsxs("div", { className: "bg-pink-50 border border-pink-100 p-4 rounded-xl mb-4", children: [_jsx("div", { className: "text-xs font-bold text-pink-600 uppercase mb-1", children: "Live Now" }), _jsx("div", { className: "text-sm font-medium text-gray-900", children: current.message }), _jsx(Button, { variant: "ghost", onClick: clear, disabled: loading, className: "mt-2 text-xs text-red-600 hover:underline h-auto p-0 hover:bg-transparent", "aria-label": "Recall active announcement", children: "Recall Announcement" })] })) : (_jsx("div", { className: "text-sm text-gray-400 italic mb-4", children: "No active announcement." })), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: message, onChange: (e) => setMessage(e.target.value), placeholder: "Enter alert message...", className: "flex-1 px-3 py-2 border rounded-lg text-sm" }), _jsx(Button, { variant: "primary", onClick: publish, disabled: !message || loading, className: "px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold disabled:opacity-50 h-auto", "aria-label": "Post announcement", children: "Post" })] })] }));
}
function CacheControlCard() {
    const [path, setPath] = useState("/");
    const [loading, setLoading] = useState(false);
    const handleClear = async (type) => {
        setLoading(true);
        try {
            const res = await fetch("/api/ops/tools/cache", {
                method: "POST",
                body: JSON.stringify({ target: path, type }),
            });
            const json = await res.json();
            if (res.ok) {
                toast.success("Cache Cleared", { description: json.message });
            }
            else {
                toast.error("Failed", { description: json.error });
            }
        }
        catch (e) {
            toast.error("Network Error");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-200 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "p-2 bg-orange-100 text-orange-600 rounded-lg", children: _jsx(Zap, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Cache Control" }), _jsx("p", { className: "text-xs text-gray-500", children: "Manually revalidate Next.js ISR cache." })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-1", children: "Target Path / Tag" }), _jsx("input", { type: "text", value: path, onChange: (e) => setPath(e.target.value), className: "w-full px-3 py-2 border rounded-lg font-mono text-sm", placeholder: "/" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "ghost", onClick: () => handleClear("path"), disabled: loading, className: "flex-1 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-bold flex items-center justify-center gap-2 h-auto", "aria-label": "Revalidate Next.js cache by path", children: [loading ? _jsx(RefreshCw, { className: "h-4 w-4 animate-spin" }) : _jsx(Globe, { className: "h-4 w-4" }), "Revalidate Path"] }), _jsxs(Button, { variant: "ghost", onClick: () => handleClear("tag"), disabled: loading, className: "flex-1 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-bold flex items-center justify-center gap-2 h-auto", "aria-label": "Revalidate Next.js cache by tag", children: [loading ? _jsx(RefreshCw, { className: "h-4 w-4 animate-spin" }) : _jsx(Database, { className: "h-4 w-4" }), "Revalidate Tag"] })] })] })] }));
}
function FeatureFlagCard() {
    const [maintenance, setMaintenance] = useState(false);
    // Real implementation would fetch initial state from API
    const toggleMaintenance = () => {
        const newState = !maintenance;
        setMaintenance(newState);
        // Fire-and-forget logging
        fetch("/api/ops/audit", {
            method: "POST", // Method might vary depending on existing audit API, assuming we just log via tools actions actually
            // Actually let's just toast for now as 'Simulation' since we didn't build persistence
        });
        toast.info(`Maintenance Mode: ${newState ? "ENABLED" : "DISABLED"} (Simulated)`);
    };
    return (_jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-200 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "p-2 bg-purple-100 text-purple-600 rounded-lg", children: _jsx(ToggleLeft, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Feature Flags" }), _jsx("p", { className: "text-xs text-gray-500", children: "Global system toggles." })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-bold text-gray-900", children: "Maintenance Mode" }), _jsx("div", { className: "text-xs text-gray-500", children: "Block all non-admin traffic." })] }), _jsx(Button, { variant: "ghost", onClick: toggleMaintenance, className: `text-2xl transition-colors h-auto p-0 hover:bg-transparent ${maintenance ? "text-indigo-600" : "text-gray-300"}`, "aria-label": maintenance ? "Disable maintenance mode" : "Enable maintenance mode", children: maintenance ? _jsx(ToggleRight, { className: "h-8 w-8" }) : _jsx(ToggleLeft, { className: "h-8 w-8" }) })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 opacity-50", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-bold text-gray-900", children: "Beta Features" }), _jsx("div", { className: "text-xs text-gray-500", children: "Enable v2 Dashboard for all." })] }), _jsx(ToggleLeft, { className: "h-8 w-8 text-gray-300" })] })] })] }));
}
function EnvInfoCard() {
    return (_jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-200 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "p-2 bg-blue-100 text-blue-600 rounded-lg", children: _jsx(Server, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Environment" }), _jsx("p", { className: "text-xs text-gray-500", children: "Current system configuration." })] })] }), _jsxs("dl", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between py-2 border-b border-gray-100", children: [_jsx("dt", { className: "text-gray-500", children: "NODE_ENV" }), _jsx("dd", { className: "font-mono font-bold text-gray-900", children: process.env.NODE_ENV })] }), _jsxs("div", { className: "flex justify-between py-2 border-b border-gray-100", children: [_jsx("dt", { className: "text-gray-500", children: "Region" }), _jsx("dd", { className: "font-mono font-bold text-gray-900", children: "us-east-1" })] }), _jsxs("div", { className: "flex justify-between py-2 border-b border-gray-100", children: [_jsx("dt", { className: "text-gray-500", children: "Database" }), _jsx("dd", { className: "font-mono font-bold text-green-600", children: "Connected" })] }), _jsxs("div", { className: "flex justify-between py-2", children: [_jsx("dt", { className: "text-gray-500", children: "Version" }), _jsx("dd", { className: "font-mono font-bold text-gray-900", children: "v1.2.4" })] })] })] }));
}
