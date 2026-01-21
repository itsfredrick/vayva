"use client";

import { useEffect, useState } from "react";
import { Button, cn } from "@vayva/ui";
import { useToast } from "@/components/ui/use-toast";

type KycRecord = {
  id: string;
  storeId: string;
  status: string;
  ninLast4: string;
  bvnLast4: string;
  cacNumberEncrypted?: string | null;
  submittedAt: string;
  reviewedAt?: string | null;
  notes?: string | null;
  store?: {
    id: string;
    name: string;
    slug: string;
    industrySlug?: string | null;
    onboardingStatus?: string;
    onboardingLastStep?: string | null;
  };
  bank?: {
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
  } | null;
};

export default function KycQueuePage() {
  const { toast } = useToast();
  const [records, setRecords] = useState<KycRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [note, setNote] = useState<Record<string, string>>({});
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ops/kyc");
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      setRecords(data.data || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load KYC queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/ops/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          action,
          notes: note[id],
          rejectionReason: rejectReason[id],
        }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      await load();
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to update", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-8 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 space-y-4">
        <div className="text-red-600 font-semibold">Error: {error}</div>
        <Button onClick={load} aria-label="Retry loading KYC queue">Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KYC Review Queue</h1>
        <p className="text-sm text-gray-500">Review BVN/NIN/CAC submissions and approve/reject.</p>
      </div>

      {records.length === 0 ? (
        <div className="p-6 rounded-xl border border-gray-200 bg-white text-sm text-gray-600">
          No pending KYC records.
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    {rec.store?.industrySlug || "unknown"}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">{rec.store?.name || "Unknown Store"}</h3>
                  <p className="text-xs text-gray-500">Slug: {rec.store?.slug}</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  Submitted: {new Date(rec.submittedAt).toLocaleString()}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-800">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="font-semibold text-gray-700">Identity</div>
                  <div className="text-xs text-gray-500">NIN Last 4</div>
                  <div className="font-mono">{rec.ninLast4 || "N/A"}</div>
                  <div className="text-xs text-gray-500 mt-1">CAC</div>
                  <div className="font-mono">{rec.cacNumberEncrypted ? "Provided" : "Not provided"}</div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="font-semibold text-gray-700">Bank</div>
                  <div className="text-xs text-gray-500">Account Name</div>
                  <div className="font-mono">{rec.bank?.accountName || "N/A"}</div>
                  <div className="text-xs text-gray-500 mt-1">Account</div>
                  <div className="font-mono">
                    {rec.bank?.bankName} • {rec.bank?.accountNumber}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="font-semibold text-gray-700">Onboarding</div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="font-medium">{rec.store?.onboardingStatus || "N/A"}</div>
                  <div className="text-xs text-gray-500 mt-1">Last step</div>
                  <div className="font-mono">{rec.store?.onboardingLastStep || "N/A"}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Notes</label>
                  <textarea
                    className="w-full rounded-xl border border-gray-200 p-2 text-sm"
                    rows={2}
                    value={note[rec.id] || ""}
                    onChange={(e) => setNote((prev) => ({ ...prev, [rec.id]: e.target.value }))}
                    placeholder="Internal notes"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Rejection reason (if rejecting)</label>
                  <textarea
                    className="w-full rounded-xl border border-gray-200 p-2 text-sm"
                    rows={2}
                    value={rejectReason[rec.id] || ""}
                    onChange={(e) => setRejectReason((prev) => ({ ...prev, [rec.id]: e.target.value }))}
                    placeholder="Why rejecting?"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                <Button
                  variant="ghost"
                  className={cn("border border-red-200 text-red-700 hover:bg-red-50 h-auto")}
                  disabled={actionLoading === rec.id}
                  onClick={() => act(rec.id, "reject")}
                  aria-label={`Reject KYC for ${rec.store?.name}`}
                >
                  Reject
                </Button>
                <Button
                  className="bg-black text-white h-auto"
                  disabled={actionLoading === rec.id}
                  onClick={() => act(rec.id, "approve")}
                  aria-label={`Approve KYC for ${rec.store?.name}`}
                >
                  {actionLoading === rec.id ? "Saving..." : "Approve"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
