"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { offlineStorage } from "@/services/offline.service";
export function OfflineSyncBanner() {
    const [status, setStatus] = useState({
        isOnline: true,
        pendingCount: 0,
        isSyncing: false,
    });
    useEffect(() => {
        const updateOnlineStatus = () => {
            setStatus((s) => ({ ...s, isOnline: navigator.onLine }));
        };
        const checkPending = async () => {
            try {
                await offlineStorage.init();
                const pending = await offlineStorage.getPendingActions();
                setStatus((s) => ({ ...s, pendingCount: pending.length }));
            }
            catch { }
        };
        window.addEventListener("online", updateOnlineStatus);
        window.addEventListener("offline", updateOnlineStatus);
        checkPending();
        return () => {
            window.removeEventListener("online", updateOnlineStatus);
            window.removeEventListener("offline", updateOnlineStatus);
        };
    }, []);
    if (status.isOnline && status.pendingCount === 0)
        return null;
    return (_jsx("div", { className: `fixed top-0 left-0 right-0 z-50 px-4 py-2 text-sm text-center ${status.isOnline ? "bg-blue-500 text-white" : "bg-yellow-500 text-black"}`, children: !status.isOnline ? (_jsx("span", { children: "\uD83D\uDCE1 You're offline. Actions will sync when connected." })) : status.isSyncing ? (_jsxs("span", { children: ["\u23F3 Syncing ", status.pendingCount, " actions..."] })) : (_jsxs("span", { children: ["\u2713 ", status.pendingCount, " actions queued for sync"] })) }));
}
