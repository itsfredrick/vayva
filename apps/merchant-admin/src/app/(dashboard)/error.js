"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { Button } from "@vayva/ui";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { logger } from "@/lib/logger";
export default function DashboardError({ error, reset, }) {
    useEffect(() => {
        // Log exception using our structured logger
        logger.error("Dashboard Crash", error, {
            digest: error.digest,
            component: "DashboardError",
        });
    }, [error]);
    return (_jsxs("div", { className: "flex h-full w-full flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-300", children: [_jsx("div", { className: "mb-6 rounded-full bg-red-50 p-6 ring-1 ring-red-100 dark:bg-red-900/20 dark:ring-red-900/40", children: _jsx(AlertTriangle, { className: "h-10 w-10 text-red-600 dark:text-red-400" }) }), _jsx("h2", { className: "mb-2 text-2xl font-semibold tracking-tight", children: "Something went wrong" }), _jsx("p", { className: "mb-8 max-w-sm text-muted-foreground", children: "We encountered an error loading your dashboard. This has been logged for our engineering team." }), _jsxs("div", { className: "flex gap-4", children: [_jsxs(Button, { variant: "outline", onClick: () => window.location.reload(), children: [_jsx(RefreshCcw, { className: "mr-2 h-4 w-4" }), "Reload Page"] }), _jsx(Button, { onClick: () => reset(), children: "Try Again" })] }), process.env.NODE_ENV === "development" && (_jsxs("div", { className: "mt-8 w-full max-w-xl overflow-hidden rounded bg-secondary p-4 text-left font-mono text-xs", children: [_jsx("p", { className: "mb-2 font-bold text-red-500", children: "Dev Error Details:" }), _jsx("pre", { className: "whitespace-pre-wrap break-words", children: error.message }), error.stack && (_jsx("pre", { className: "mt-2 whitespace-pre-wrap break-words opacity-50", children: error.stack }))] }))] }));
}
