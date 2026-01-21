"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { AlertCircle, ArrowLeft, ChevronRight, Database, Server, Activity, Play, RotateCcw, ShieldX, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@vayva/ui";
import { useToast } from "@/components/ui/use-toast";
export default function IncidentDetailPage({ params }) {
    const { toast } = useToast();
    const [incident, setIncident] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    useEffect(() => {
        fetchIncident();
    }, [params.id]);
    const fetchIncident = async () => {
        try {
            const res = await fetch(`/api/ops/rescue/incidents/${params.id}`);
            setIncident(await res.json());
        }
        catch (error) {
            console.error("Fetch incident fail:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const runAction = async (actionType) => {
        setActionLoading(actionType);
        try {
            const res = await fetch(`/api/ops/rescue/incidents/${params.id}/actions`, {
                method: "POST",
                body: JSON.stringify({ actionType }),
            });
            if (res.ok) {
                toast({ title: "Success", description: "Action executed successfully!" });
                fetchIncident();
            }
        }
        catch (error) {
            toast({ title: "Error", description: "Action failed.", variant: "destructive" });
        }
        finally {
            setActionLoading(null);
        }
    };
    if (loading)
        return _jsx("div", { className: "p-8 text-center animate-pulse", children: "Loading incident..." });
    if (!incident)
        return _jsx("div", { className: "p-8 text-center text-red-500", children: "Incident not found." });
    const aiAnalysis = incident.diagnostics?.aiAnalysis || {};
    return (_jsxs("div", { className: "p-8 space-y-8 bg-gray-50 min-h-screen", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Link, { href: "/ops/rescue", className: "p-2 hover:bg-white rounded-lg transition-colors", children: _jsx(ArrowLeft, { className: "w-5 h-5 text-gray-500" }) }), _jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest", children: [_jsx(Link, { href: "/ops/rescue", className: "hover:text-indigo-600", children: "Rescue" }), _jsx(ChevronRight, { className: "w-3 h-3" }), _jsx("span", { children: "Incident Detail" })] })] }), _jsxs("div", { className: "grid lg:grid-cols-[1fr_400px] gap-8", children: [_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "bg-white p-8 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden", children: [_jsx("div", { className: `absolute top-0 left-0 w-2 h-full ${incident.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500'}` }), _jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { className: "flex gap-4 items-center", children: [_jsx("span", { className: "px-3 py-1 rounded-full text-[10px] font-black bg-gray-900 text-white uppercase", children: incident.status }), _jsxs("span", { className: "text-sm font-bold text-gray-400", children: ["#", incident.id.slice(0, 8)] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-xs text-gray-400", children: "First Detected" }), _jsx("div", { className: "text-sm font-bold text-gray-900", children: new Date(incident.createdAt).toLocaleString() })] })] }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: incident.errorType }), _jsx("p", { className: "text-lg text-gray-600 mb-8", children: incident.errorMessage }), _jsxs("div", { className: "flex flex-wrap gap-4 pt-6 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl", children: [_jsx(Server, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-sm font-bold text-gray-700", children: incident.surface })] }), incident.route && (_jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl", children: [_jsx(Activity, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: incident.route })] })), incident.storeId && (_jsxs(Link, { href: `/ops/merchants/${incident.storeId}`, className: "flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors", children: [_jsx(Database, { className: "w-4 h-4 text-indigo-400" }), _jsxs("span", { className: "text-sm font-bold text-indigo-700", children: ["Store: ", incident.storeId.slice(0, 8)] })] }))] })] }), _jsxs("div", { className: "bg-[#0F172A] p-8 rounded-3xl text-white relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full" }), _jsxs("div", { className: "flex items-center gap-3 mb-6 relative z-10", children: [_jsx(Sparkles, { className: "w-6 h-6 text-indigo-400" }), _jsx("h3", { className: "text-xl font-bold", children: "AI Rescue Advisor" })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-8 relative z-10", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "text-xs font-bold text-indigo-400 uppercase tracking-widest", children: "Classification" }), _jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { className: "bg-white/10 px-3 py-1 rounded-lg font-bold", children: aiAnalysis.classification || "ANALYIZING..." }) }), _jsx("div", { className: "text-xs font-bold text-indigo-400 uppercase tracking-widest mt-6", children: "Recommended Patch" }), _jsx("p", { className: "text-gray-300 text-sm leading-relaxed", children: aiAnalysis.remediation || "Standby for incoming diagnostics summary..." })] }), _jsxs("div", { className: "p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm", children: [_jsx("h4", { className: "text-sm font-bold mb-4", children: "Safe Actions Available" }), _jsx("div", { className: "space-y-3", children: ["RETRY_JOB", "REPROCESS_WEBHOOK", "HEALTH_CHECK"].map(act => (_jsxs(Button, { variant: "ghost", onClick: () => runAction(act), disabled: !!actionLoading, className: "w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-bold group h-auto text-white hover:text-white", children: [_jsxs("div", { className: "flex items-center gap-3", children: [act === "RETRY_JOB" && _jsx(RotateCcw, { className: "w-4 h-4" }), act === "REPROCESS_WEBHOOK" && _jsx(Play, { className: "w-4 h-4" }), act === "HEALTH_CHECK" && _jsx(Activity, { className: "w-4 h-4" }), act.replace('_', ' ')] }), _jsx(ChevronRight, { className: "w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" })] }, act))) })] })] })] }), _jsxs("div", { className: "bg-white p-8 rounded-3xl border border-gray-200", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-8", children: "Incident Timeline" }), _jsxs("div", { className: "space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100", children: [incident.FixActions.map((fix) => (_jsxs("div", { className: "relative pl-12", children: [_jsx("div", { className: `absolute left-0 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${fix.actionStatus === 'SUCCESS' ? 'bg-green-500' : 'bg-red-500'}`, children: _jsx(RotateCcw, { className: "w-4 h-4 text-white" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx("span", { className: "text-sm font-bold text-gray-900", children: fix.actionType }), _jsx("span", { className: "text-xs text-gray-400", children: new Date(fix.createdAt).toLocaleTimeString() })] }), _jsx("p", { className: "text-sm text-gray-600", children: fix.summary }), _jsxs("div", { className: "text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest", children: ["BY ", fix.performedBy] })] })] }, fix.id))), _jsxs("div", { className: "relative pl-12", children: [_jsx("div", { className: "absolute left-0 w-9 h-9 rounded-full bg-[#0F172A] flex items-center justify-center border-4 border-white shadow-sm", children: _jsx(AlertCircle, { className: "w-4 h-4 text-white" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx("span", { className: "text-sm font-bold text-gray-900", children: "Incident Detected" }), _jsx("span", { className: "text-xs text-gray-400", children: new Date(incident.createdAt).toLocaleTimeString() })] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Initial error ingestion recorded on ", incident.surface, " surface."] })] })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-3xl border border-gray-200 shadow-sm", children: [_jsx("h4", { className: "text-sm font-black uppercase text-gray-400 tracking-widest mb-6", children: "Diagnostics JSON" }), _jsx("div", { className: "bg-gray-950 p-4 rounded-xl overflow-x-auto", children: _jsx("pre", { className: "text-[10px] text-green-400 font-mono", children: JSON.stringify(incident.diagnostics, null, 2) }) })] }), _jsxs("div", { className: "p-6 bg-red-50 rounded-3xl border border-red-100", children: [_jsxs("h4", { className: "flex items-center gap-2 text-red-700 font-bold mb-4", children: [_jsx(ShieldX, { className: "w-4 h-4" }), "Destructive Actions"] }), _jsx("p", { className: "text-xs text-red-600 mb-6", children: "These actions may cause data loss or service interruption. Use with caution." }), _jsx(Button, { variant: "outline", className: "w-full border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all", children: "Mark as False Positive" })] })] })] })] }));
}
