"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
/**
 * Safely displays formatted time/date in Client Components to avoid
 * Next.js hydration mismatches.
 */
export function TimeDisplay({ date, format = "time", className, suppressHydrationWarning = true, }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        // Return a skeleton or just an empty span during SSR
        return _jsx("span", { className: className, children: "..." });
    }
    const d = new Date(date);
    let formatted = "";
    if (format === "time") {
        formatted = d.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    else if (format === "date") {
        formatted = d.toLocaleDateString();
    }
    else {
        formatted = `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    }
    return (_jsx("span", { className: className, suppressHydrationWarning: suppressHydrationWarning, children: formatted }));
}
