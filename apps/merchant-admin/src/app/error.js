"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { logger } from "@/lib/logger";
import { RescueOverlay } from "@/components/rescue/RescueOverlay";
export default function Error({ error, reset, }) {
    useEffect(() => {
        logger.error("Client Error Boundary Caught Error", error, {
            digest: error.digest,
        });
    }, [error]);
    return _jsx(RescueOverlay, { error: error, reset: reset });
}
