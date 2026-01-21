"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Loader2, RefreshCw, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@vayva/ui";
import { useRouter } from "next/navigation";
export function RescueOverlay({ error, reset }) {
    const router = useRouter();
    const [incidentId, setIncidentId] = useState(null);
    const [status, setStatus] = useState("INIT");
    const [statusMessage, setStatusMessage] = useState("Checking system status...");
    useEffect(() => {
        // Initiate Rescue
        const reportError = async () => {
            try {
                const res = await fetch("/api/rescue/report", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        route: window.location.pathname,
                        errorMessage: error.message,
                        stackHash: error.digest || error.stack?.slice(0, 100),
                    }),
                });
                const data = await res.json();
                if (data.incidentId) {
                    setIncidentId(data.incidentId);
                    setStatus("RUNNING");
                    setStatusMessage("Analyzing issue...");
                }
            }
            catch (err) {
                console.error("Failed to report to rescue service", err);
                setStatus("NEEDS_ENGINEERING");
                setStatusMessage("Please try refreshing directly.");
            }
        };
        reportError();
    }, [error]);
    // Polling
    useEffect(() => {
        if (!incidentId || status === "READY_TO_REFRESH" || status === "NEEDS_ENGINEERING")
            return;
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/rescue/incidents/${incidentId}`);
                const data = await res.json();
                if (data.status === "READY_TO_REFRESH") {
                    setStatus("READY_TO_REFRESH");
                    setStatusMessage("System ready. Please refresh.");
                }
                else if (data.status === "NEEDS_ENGINEERING") {
                    setStatus("NEEDS_ENGINEERING");
                    setStatusMessage("Our team has been notified.");
                }
            }
            catch (err) {
                console.error("Poll fail", err);
            }
        }, 2500);
        return () => clearInterval(interval);
    }, [incidentId, status]);
    const handleRefresh = () => {
        router.refresh();
        reset();
    };
    return (_jsx("div", { className: "fixed inset-0 z-[9999] bg-white text-black flex items-center justify-center p-4 font-sans", children: _jsxs("div", { className: "text-center max-w-sm w-full", children: [_jsx("div", { className: "flex justify-center mb-6", children: _jsx("div", { className: `p-4 rounded-full ${status === 'RUNNING' ? 'bg-gray-100 animate-pulse' : 'bg-green-50'}`, children: status === 'RUNNING' || status === 'INIT' ? (_jsx(Loader2, { className: "w-8 h-8 text-black animate-spin" })) : status === 'NEEDS_ENGINEERING' ? (_jsx(AlertCircle, { className: "w-8 h-8 text-gray-400" })) : (_jsx(ShieldCheck, { className: "w-8 h-8 text-green-600" })) }) }), _jsx("h2", { className: "text-xl font-bold mb-2", children: "One moment..." }), _jsx("p", { className: "text-gray-500 mb-8 text-sm", children: statusMessage }), _jsx("div", { className: "space-y-3", children: (status === "READY_TO_REFRESH" || status === "NEEDS_ENGINEERING") ? (_jsxs(Button, { onClick: handleRefresh, className: "w-full text-white bg-black hover:bg-gray-800 rounded-xl py-6", children: [_jsx(RefreshCw, { className: "w-4 h-4 mr-2" }), "Reload Page"] })) : (_jsx("div", { className: "h-12 flex items-center justify-center text-xs font-bold text-gray-300 uppercase tracking-widest", children: "Running Diagnostics" })) }), incidentId && (_jsxs("div", { className: "mt-8 text-[10px] text-gray-300 font-mono", children: ["ID: ", incidentId.slice(0, 8)] }))] }) }));
}
