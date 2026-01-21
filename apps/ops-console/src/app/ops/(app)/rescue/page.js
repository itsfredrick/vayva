"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, Clock, ShieldCheck, History, Settings, Zap, ArrowRight, RefreshCw, Webhook, Play, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@vayva/ui";
export default function RescueConsolePage() {
    const [activeTab, setActiveTab] = useState("incidents");
    const [incidents, setIncidents] = useState([]);
    const [fixes, setFixes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [runningRunbook, setRunningRunbook] = useState(null);
    useEffect(() => {
        fetchData();
    }, [activeTab]);
    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === "incidents") {
                const res = await fetch("/api/ops/rescue/incidents");
                setIncidents(await res.json());
            }
            else if (activeTab === "history") {
                const res = await fetch("/api/ops/rescue/fixes");
                setFixes(await res.json());
            }
        }
        catch (error) {
            console.error("Rescue fetch error:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const runRunbook = async (id, title) => {
        if (!confirm(`Run runbook: ${title}? This will execute automated recovery steps.`))
            return;
        setRunningRunbook(id);
        const promise = fetch("/api/ops/rescue/runbooks", {
            method: "POST",
            body: JSON.stringify({ runbookId: id }),
        }).then(async (res) => {
            const json = await res.json();
            if (!json.success)
                throw new Error(json.error);
            return json;
        });
        toast.promise(promise, {
            loading: "Executing runbook...",
            success: (data) => `Runbook Completed: ${JSON.stringify(data.result)}`,
            error: (err) => `Runbook Failed: ${err.message}`,
        });
        try {
            await promise;
        }
        catch (e) {
            // Toast handles it
        }
        finally {
            setRunningRunbook(null);
        }
    };
    const getSeverityColor = (sev) => {
        switch (sev) {
            case "CRITICAL": return "text-red-700 bg-red-100 border-red-200";
            case "HIGH": return "text-orange-700 bg-orange-100 border-orange-200";
            case "MEDIUM": return "text-amber-700 bg-amber-100 border-amber-200";
            default: return "text-blue-700 bg-blue-100 border-blue-200";
        }
    };
    return (_jsxs("div", { className: "p-8 space-y-8 bg-gray-50 min-h-screen", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-3", children: [_jsx(ShieldCheck, { className: "w-8 h-8 text-indigo-600" }), "Vayva Rescue"] }), _jsx("p", { className: "text-gray-500 mt-1", children: "AI-powered platform diagnostics and self-healing" })] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: fetchData, className: "p-2 text-gray-400 hover:text-indigo-600 transition-colors h-10 w-10 flex items-center justify-center", "aria-label": "Refresh rescue diagnostics", children: _jsx(RefreshCw, { className: `w-5 h-5 ${loading ? 'animate-spin' : ''}` }) })] }), _jsx("div", { className: "flex gap-1 bg-white p-1 rounded-xl border border-gray-200 w-fit", children: [
                    { id: "incidents", label: "Open Incidents", icon: AlertCircle },
                    { id: "history", label: "Fix History", icon: History },
                    { id: "runbook", label: "Runbooks", icon: Zap },
                    { id: "settings", label: "Settings", icon: Settings },
                ].map((tab) => (_jsxs(Button, { variant: "ghost", onClick: () => setActiveTab(tab.id), className: `flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all h-auto ${activeTab === tab.id
                        ? "bg-[#0F172A] text-white shadow-lg hover:bg-[#0F172A] hover:text-white"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`, "aria-label": `Switch to ${tab.label} tab`, children: [_jsx(tab.icon, { className: "w-4 h-4" }), tab.label] }, tab.id))) }), loading ? (_jsx("div", { className: "grid grid-cols-1 gap-6", children: [1, 2, 3].map(i => (_jsx("div", { className: "h-32 bg-white rounded-2xl animate-pulse" }, i))) })) : (_jsxs("div", { className: "space-y-6", children: [activeTab === "incidents" && (_jsx("div", { className: "grid grid-cols-1 gap-4", children: incidents.length === 0 ? (_jsxs("div", { className: "text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200", children: [_jsx(CheckCircle2, { className: "w-12 h-12 text-green-500 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-bold text-gray-900", children: "All systems operational" }), _jsx("p", { className: "text-gray-500", children: "No open rescue incidents found." })] })) : (incidents.map((incident) => (_jsx(Link, { href: `/ops/rescue/${incident.id}`, className: "block group", children: _jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-600 hover:shadow-xl transition-all relative overflow-hidden", children: [_jsxs("div", { className: "flex items-start justify-between relative z-10", children: [_jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: `p-3 rounded-xl ${getSeverityColor(incident.severity)}`, children: _jsx(AlertCircle, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded border ${getSeverityColor(incident.severity)}`, children: incident.severity }), _jsx("span", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest", children: incident.surface }), _jsxs("span", { className: "text-xs text-gray-400 flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), new Date(incident.createdAt).toLocaleTimeString()] })] }), _jsx("h3", { className: "text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors", children: incident.errorType }), _jsx("p", { className: "text-sm text-gray-600 mt-1 line-clamp-1", children: incident.errorMessage })] })] }), _jsx(ArrowRight, { className: "w-5 h-5 text-gray-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" })] }), _jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" })] }) }, incident.id)))) })), activeTab === "history" && (_jsx("div", { className: "bg-white rounded-2xl border border-gray-200 overflow-hidden", children: _jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { className: "bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4", children: "Action" }), _jsx("th", { className: "px-6 py-4", children: "Incident" }), _jsx("th", { className: "px-6 py-4", children: "Status" }), _jsx("th", { className: "px-6 py-4", children: "Summary" }), _jsx("th", { className: "px-6 py-4", children: "Performed By" }), _jsx("th", { className: "px-6 py-4", children: "Time" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: Array.isArray(fixes) && fixes.map((fix) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4 font-bold text-sm text-[#0F172A]", children: fix.actionType }), _jsx("td", { className: "px-6 py-4 text-xs text-indigo-600 hover:underline", children: _jsx(Link, { href: `/ops/rescue/${fix.incidentId}`, children: fix.Incident?.errorType || fix.incidentId.slice(0, 8) }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded ${fix.actionStatus === 'SUCCESS' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`, children: fix.actionStatus }) }), _jsx("td", { className: "px-6 py-4 text-xs text-gray-600", children: fix.summary }), _jsx("td", { className: "px-6 py-4 text-xs font-medium", children: fix.performedBy }), _jsx("td", { className: "px-6 py-4 text-xs text-gray-400", children: new Date(fix.createdAt).toLocaleString() })] }, fix.id))) })] }) })), activeTab === "runbook" && (_jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
                            { id: "webhook-recovery", title: "Webhook Recovery", desc: "Common steps for Paystack/Kwik failures", icon: Webhook },
                            { id: "job-stuck-mitigation", title: "Job Stuck Mitigation", desc: "Dealing with BullMQ congestion", icon: Zap },
                            { id: "auth-sync-repair", title: "Auth Sync Repair", desc: "Resolving session inconsistencies", icon: ShieldCheck },
                        ].map((rb) => (_jsxs(Button, { variant: "ghost", onClick: () => runRunbook(rb.id, rb.title), disabled: !!runningRunbook, className: `p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all text-left group h-auto block w-full hover:bg-white ${runningRunbook === rb.id ? 'opacity-75 animate-pulse cursor-wait' : ''}`, "aria-label": `Run automation: ${rb.title}`, children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors", children: runningRunbook === rb.id ? _jsx(Loader2, { className: "h-5 w-5 animate-spin" }) : _jsx(rb.icon, { className: "w-5 h-5 text-indigo-600 group-hover:text-white" }) }), _jsx("h4", { className: "font-bold text-gray-900 group-hover:text-indigo-600 transition-colors", children: rb.title }), _jsx("p", { className: "text-sm text-gray-500 mt-2", children: rb.desc }), _jsxs("div", { className: "mt-4 flex items-center gap-2 text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0", children: [_jsx(Play, { className: "w-3 h-3 fill-current" }), " Run Automation"] })] }, rb.id))) }))] }))] }));
}
