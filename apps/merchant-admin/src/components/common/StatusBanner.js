"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { AlertTriangle, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@vayva/ui";
export function StatusBanner() {
    const [status, setStatus] = useState("IDLE");
    const [isDismissed, setIsDismissed] = useState(false);
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch("/api/health/integrations");
                const data = await res.json();
                const health = data.health;
                const values = Object.values(health || {}).map((v) => v.status);
                if (values.includes("FAIL"))
                    setStatus("DOWN");
                else if (values.includes("WARNING"))
                    setStatus("DEGRADED");
                else
                    setStatus("IDLE");
            }
            catch (e) {
                // Silent fail
            }
        };
        checkStatus();
        const interval = setInterval(checkStatus, 300000); // 5 mins
        return () => clearInterval(interval);
    }, []);
    if (status === "IDLE" || isDismissed)
        return null;
    return (_jsxs("div", { className: `w-full p-2 flex items-center justify-center gap-4 transition-all animate-in slide-in-from-top duration-500 ${status === "DOWN" ? "bg-red-600" : "bg-amber-500"} text-white text-xs font-semibold py-3`, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertTriangle, { className: "w-4 h-4 animate-pulse" }), _jsx("span", { children: status === "DOWN"
                            ? "System Alert: Critical infrastructure outage detected."
                            : "Notice: Some integration services are currently degraded." })] }), _jsxs(Link, { href: "/dashboard/status", className: "flex items-center gap-1 hover:underline underline-offset-4", children: ["View Status Report ", _jsx(ChevronRight, { className: "w-3 h-3" })] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setIsDismissed(true), className: "absolute right-4 opacity-70 hover:opacity-100 h-6 w-6 text-white hover:bg-white/20 hover:text-white", children: _jsx(X, { className: "w-4 h-4" }) })] }));
}
