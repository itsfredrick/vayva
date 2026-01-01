"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, ChevronRight, X } from "lucide-react";
import Link from "next/link";

export function StatusBanner() {
  const [status, setStatus] = useState<"IDLE" | "DEGRADED" | "DOWN">("IDLE");
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/health/integrations");
        const data = await res.json();
        const health = data.health;

        const values = Object.values(health || {}).map((v: any) => v.status);
        if (values.includes("FAIL")) setStatus("DOWN");
        else if (values.includes("WARNING")) setStatus("DEGRADED");
        else setStatus("IDLE");
      } catch (e) {
        // Silent fail
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  if (status === "IDLE" || isDismissed) return null;

  return (
    <div
      className={`w-full p-2 flex items-center justify-center gap-4 transition-all animate-in slide-in-from-top duration-500 ${status === "DOWN" ? "bg-red-600" : "bg-amber-500"
        } text-white text-xs font-semibold py-3`}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 animate-pulse" />
        <span>
          {status === "DOWN"
            ? "System Alert: Critical infrastructure outage detected."
            : "Notice: Some integration services are currently degraded."}
        </span>
      </div>
      <Link
        href="/dashboard/status"
        className="flex items-center gap-1 hover:underline underline-offset-4"
      >
        View Status Report <ChevronRight className="w-3 h-3" />
      </Link>
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute right-4 opacity-70 hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
