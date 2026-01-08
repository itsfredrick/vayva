"use client";

import React, { useEffect, useState } from "react";
import { Loader2, RefreshCw, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@vayva/ui";
import { useRouter } from "next/navigation";

interface RescueOverlayProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export function RescueOverlay({ error, reset }: RescueOverlayProps) {
    const router = useRouter();
    const [incidentId, setIncidentId] = useState<string | null>(null);
    const [status, setStatus] = useState<"INIT" | "RUNNING" | "READY_TO_REFRESH" | "NEEDS_ENGINEERING">("INIT");
    const [statusMessage, setStatusMessage] = useState("Vayva Rescue is checking things...");

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
                    setStatusMessage("Collecting diagnostics...");
                }
            } catch (err) {
                console.error("Failed to report to rescue service", err);
                // Fallback to manual mode if API fails
                setStatus("NEEDS_ENGINEERING");
                setStatusMessage("Please try refreshing manually.");
            }
        };

        reportError();
    }, [error]);

    // Polling for status updates
    useEffect(() => {
        if (!incidentId || status === "READY_TO_REFRESH" || status === "NEEDS_ENGINEERING") return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/rescue/incidents/${incidentId}`);
                const data = await res.json();

                if (data.status === "READY_TO_REFRESH") {
                    setStatus("READY_TO_REFRESH");
                    setStatusMessage("All set. Please refresh to continue.");
                } else if (data.status === "NEEDS_ENGINEERING") {
                    setStatus("NEEDS_ENGINEERING");
                    setStatusMessage("This issue has been logged for our team.");
                } else {
                    // Still running
                    setStatusMessage("Analyzing safe fixes...");
                }
            } catch (err) {
                console.error("Poll fail", err);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [incidentId, status]);

    const handleRefresh = () => {
        // Attempt standard Next.js refresh
        router.refresh();
        reset();
        // If that doesn't work, standard full reload might be needed but router.refresh + reset is milder
    };

    return (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full overflow-hidden p-8 text-center animate-in fade-in zoom-in duration-300">

                <div className="flex justify-center mb-6">
                    <div className={`p-4 rounded-full ${status === 'RUNNING' ? 'bg-indigo-50 animate-pulse' : 'bg-green-50'}`}>
                        {status === 'RUNNING' || status === 'INIT' ? (
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        ) : status === 'NEEDS_ENGINEERING' ? (
                            <AlertCircle className="w-8 h-8 text-amber-500" />
                        ) : (
                            <ShieldCheck className="w-8 h-8 text-green-600" />
                        )}
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">We hit a snag</h2>
                <p className="text-gray-500 mb-8">{statusMessage}</p>

                <div className="space-y-3">
                    {(status === "READY_TO_REFRESH" || status === "NEEDS_ENGINEERING") ? (
                        <Button
                            onClick={handleRefresh}
                            className="w-full h-12 text-base font-bold bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh Page
                        </Button>
                    ) : (
                        <div className="h-12 flex items-center justify-center text-sm font-semibold text-gray-400">
                            Working on it...
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        onClick={() => window.location.reload()}
                        className="w-full text-gray-400 hover:text-gray-600"
                    >
                        Try full reload
                    </Button>
                </div>

                {incidentId && (
                    <div className="mt-8 pt-4 border-t border-gray-50 text-[10px] text-gray-300 uppercase tracking-widest">
                        Rescue Incident ID: <span className="font-mono text-gray-400">{incidentId.slice(0, 8)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
