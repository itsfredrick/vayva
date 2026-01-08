"use client";

import React, { useEffect, useState } from "react";
import { offlineStorage } from "@/services/offline.service";

interface SyncStatus {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
}

export function OfflineSyncBanner() {
  const [status, setStatus] = useState<SyncStatus>({
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
      } catch {}
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    checkPending();

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  if (status.isOnline && status.pendingCount === 0) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-sm text-center ${
        status.isOnline ? "bg-blue-500 text-white" : "bg-yellow-500 text-black"
      }`}
    >
      {!status.isOnline ? (
        <span>📡 You're offline. Actions will sync when connected.</span>
      ) : status.isSyncing ? (
        <span>⏳ Syncing {status.pendingCount} actions...</span>
      ) : (
        <span>✓ {status.pendingCount} actions queued for sync</span>
      )}
    </div>
  );
}
