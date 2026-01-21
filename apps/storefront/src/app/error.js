"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { ErrorState } from "@vayva/ui";
export default function Error({ error, reset, }) {
    useEffect(() => {
        console.error(error);
    }, [error]);
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center p-4 bg-gray-50", children: _jsx("div", { className: "w-full max-w-md", children: _jsx(ErrorState, { title: "Application Error", message: error.message || "An unexpected error occurred.", onRetry: reset }) }) }));
}
