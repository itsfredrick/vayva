"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@vayva/ui";
import { useRouter } from "next/navigation";

export function GoLiveCard() {
  const router = useRouter();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/merchant/store/publish/status");
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoLive() {
    setProcessing(true);
    try {
      const res = await fetch("/api/merchant/store/publish/go-live", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        // Success
        fetchStatus();
        // Optionally show confetti
      } else {
        if (res.status === 409) {
          // Blocked
          alert("Cannot go live. Please fix blockers.");
          fetchStatus(); // Refresh to ensure we see latest blockers
        } else {
          alert("Error: " + (data.message || "Failed"));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }

  async function handleUnpublish() {
    if (!confirm("Are you sure? Your store will go offline.")) return;
    setProcessing(true);
    try {
      await fetch("/api/merchant/store/publish/unpublish", {
        method: "POST",
        body: JSON.stringify({ reason: "Merchant initiated" }),
      });
      fetchStatus();
    } finally {
      setProcessing(false);
    }
  }

  if (loading)
    return <div className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>;
  if (!status) return null;

  const isLive = status?.isLive;
  const readiness = status?.readiness || {};
  const isReady = readiness.level === "ready";
  const blockers =
    readiness.issues?.filter((i: any) => i.severity === "blocker") || [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Store Status</h3>
          <p className="text-sm text-gray-500">Manage your public presence.</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            isLive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {isLive ? "Live" : "Offline"}
        </div>
      </div>

      {isLive ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg flex items-center gap-3">
            <Icon name={"Globe" as any} className="text-green-600" />
            <div className="flex-1">
              <div className="text-xs text-green-700 font-bold uppercase">
                Public URL
              </div>
              <a
                href="#"
                className="text-sm font-medium text-green-900 underline"
              >
                vayva.ng/store
              </a>
            </div>
            <button
              onClick={handleUnpublish}
              disabled={processing}
              className="text-xs text-red-600 font-bold hover:underline"
            >
              Unpublish
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {!isReady && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <div className="flex items-center gap-2 mb-2 text-orange-800 font-bold text-sm">
                <Icon name={"AlertTriangle" as any} size={16} />
                {blockers.length} Issues preventing Go Live
              </div>
              <div className="space-y-1">
                {blockers.map((b: any) => (
                  <div
                    key={b.code}
                    className="text-xs text-orange-700 flex justify-between"
                  >
                    <span>• {b.title}</span>
                    {b.actionUrl && (
                      <a
                        href={b.actionUrl}
                        className="underline hover:text-orange-900"
                      >
                        Fix
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleGoLive}
            disabled={!isReady || processing}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${
              !isReady
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {processing ? "Publishing..." : "Go Live Now"}
            <Icon name={"ArrowRight" as any} size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
