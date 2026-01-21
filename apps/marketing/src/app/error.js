"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { RescueOverlay } from "@/components/rescue/RescueOverlay";
export default function Error({ error, reset, }) {
    useEffect(() => {
        console.error("Marketing Client Error:", error);
    }, [error]);
    return _jsx(RescueOverlay, { error: error, reset: reset });
}
