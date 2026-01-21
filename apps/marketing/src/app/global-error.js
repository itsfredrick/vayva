"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { RescueOverlay } from "@/components/rescue/RescueOverlay";
export default function GlobalError({ error, reset, }) {
    useEffect(() => {
        console.error("Marketing Global Error:", error);
    }, [error]);
    return (_jsx("html", { children: _jsx("body", { children: _jsx(RescueOverlay, { error: error, reset: reset }) }) }));
}
