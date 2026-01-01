"use client";

import { useEffect } from "react";
import { RescueOverlay } from "@/components/rescue/RescueOverlay";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Marketing Client Error:", error);
    }, [error]);

    return <RescueOverlay error={error} reset={reset} />;
}
