"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { RescueOverlay } from "@/components/rescue/RescueOverlay";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
export default function GlobalError({ error, reset, }) {
    useEffect(() => {
        Sentry.captureException(error);
        // Log fatal error to our system
        // We import logger dynamically or use console if outside context, but here we can import.
        // However, global-error is special. Let's try to keep it simple.
    }, [error]);
    return (_jsx("html", { children: _jsx("body", { children: _jsx(RescueOverlay, { error: error, reset: reset }) }) }));
}
