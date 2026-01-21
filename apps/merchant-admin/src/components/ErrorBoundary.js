"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { ErrorBoundary as SharedErrorBoundary } from "@vayva/ui";
import * as Sentry from "@sentry/nextjs";
/**
 * Merchant Admin specific wrapper for the shared ErrorBoundary
 * that adds Sentry reporting.
 */
export function ErrorBoundary({ children, fallback, name, onError }) {
    const handleError = (error, errorInfo) => {
        Sentry.captureException(error, { extra: errorInfo });
        onError?.(error, errorInfo);
    };
    return (_jsx(SharedErrorBoundary, { name: name, fallback: fallback, onError: handleError, children: children }));
}
export { withErrorBoundary } from "@vayva/ui";
