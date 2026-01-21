"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useEducation } from "@/hooks/useEducation";
export function FirstTimeHint({ userId, guidanceId, message, onComplete, }) {
    const { shouldShow, markShown, markCompleted } = useEducation(userId, guidanceId);
    useEffect(() => {
        if (shouldShow) {
            markShown();
        }
    }, [shouldShow]);
    useEffect(() => {
        // Auto-dismiss after action completion
        if (onComplete) {
            const handleComplete = () => {
                markCompleted();
            };
            // Listen for completion event
            window.addEventListener(`education:${guidanceId}:complete`, handleComplete);
            return () => {
                window.removeEventListener(`education:${guidanceId}:complete`, handleComplete);
            };
        }
    }, [guidanceId, onComplete]);
    if (!shouldShow) {
        return null;
    }
    return (_jsxs("div", { className: "inline-flex items-start gap-2 bg-blue-50 border border-blue-200 rounded px-3 py-2 text-sm text-blue-900 mb-4", children: [_jsx("span", { className: "text-blue-500", children: "\uD83D\uDCA1" }), _jsx("p", { children: message })] }));
}
