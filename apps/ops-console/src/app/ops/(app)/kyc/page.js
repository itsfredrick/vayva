"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button, cn } from "@vayva/ui";
import { useToast } from "@/components/ui/use-toast";
export default function KycQueuePage() {
    const { toast } = useToast();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [note, setNote] = useState({});
    const [rejectReason, setRejectReason] = useState({});
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
        }
        catch (e) {
            setError(e?.message || "Failed to load KYC queue");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        load();
    }, []);
    const act = async (id, action) => {
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
        }
        catch (e) {
            toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to update", variant: "destructive" });
        }
        finally {
            setActionLoading(null);
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "p-8", children: [_jsx("div", { className: "h-8 w-40 bg-gray-200 rounded mb-4 animate-pulse" }), _jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-24 bg-gray-100 rounded-xl animate-pulse" }, i))) })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "p-8 space-y-4", children: [_jsxs("div", { className: "text-red-600 font-semibold", children: ["Error: ", error] }), _jsx(Button, { onClick: load, "aria-label": "Retry loading KYC queue", children: "Retry" })] }));
    }
    return (_jsxs("div", { className: "p-8 space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "KYC Review Queue" }), _jsx("p", { className: "text-sm text-gray-500", children: "Review BVN/NIN/CAC submissions and approve/reject." })] }), records.length === 0 ? (_jsx("div", { className: "p-6 rounded-xl border border-gray-200 bg-white text-sm text-gray-600", children: "No pending KYC records." })) : (_jsx("div", { className: "space-y-4", children: records.map((rec) => (_jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-gray-500", children: rec.store?.industrySlug || "unknown" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: rec.store?.name || "Unknown Store" }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Slug: ", rec.store?.slug] })] }), _jsxs("div", { className: "text-right text-xs text-gray-500", children: ["Submitted: ", new Date(rec.submittedAt).toLocaleString()] })] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-3 text-sm text-gray-800", children: [_jsxs("div", { className: "p-3 rounded-xl bg-gray-50 border border-gray-100", children: [_jsx("div", { className: "font-semibold text-gray-700", children: "Identity" }), _jsx("div", { className: "text-xs text-gray-500", children: "NIN Last 4" }), _jsx("div", { className: "font-mono", children: rec.ninLast4 || "N/A" }), _jsx("div", { className: "text-xs text-gray-500 mt-1", children: "CAC" }), _jsx("div", { className: "font-mono", children: rec.cacNumberEncrypted ? "Provided" : "Not provided" })] }), _jsxs("div", { className: "p-3 rounded-xl bg-gray-50 border border-gray-100", children: [_jsx("div", { className: "font-semibold text-gray-700", children: "Bank" }), _jsx("div", { className: "text-xs text-gray-500", children: "Account Name" }), _jsx("div", { className: "font-mono", children: rec.bank?.accountName || "N/A" }), _jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Account" }), _jsxs("div", { className: "font-mono", children: [rec.bank?.bankName, " \u2022 ", rec.bank?.accountNumber] })] }), _jsxs("div", { className: "p-3 rounded-xl bg-gray-50 border border-gray-100", children: [_jsx("div", { className: "font-semibold text-gray-700", children: "Onboarding" }), _jsx("div", { className: "text-xs text-gray-500", children: "Status" }), _jsx("div", { className: "font-medium", children: rec.store?.onboardingStatus || "N/A" }), _jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Last step" }), _jsx("div", { className: "font-mono", children: rec.store?.onboardingLastStep || "N/A" })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-3 text-sm", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-500 block mb-1", children: "Notes" }), _jsx("textarea", { className: "w-full rounded-xl border border-gray-200 p-2 text-sm", rows: 2, value: note[rec.id] || "", onChange: (e) => setNote((prev) => ({ ...prev, [rec.id]: e.target.value })), placeholder: "Internal notes" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-500 block mb-1", children: "Rejection reason (if rejecting)" }), _jsx("textarea", { className: "w-full rounded-xl border border-gray-200 p-2 text-sm", rows: 2, value: rejectReason[rec.id] || "", onChange: (e) => setRejectReason((prev) => ({ ...prev, [rec.id]: e.target.value })), placeholder: "Why rejecting?" })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2", children: [_jsx(Button, { variant: "ghost", className: cn("border border-red-200 text-red-700 hover:bg-red-50 h-auto"), disabled: actionLoading === rec.id, onClick: () => act(rec.id, "reject"), "aria-label": `Reject KYC for ${rec.store?.name}`, children: "Reject" }), _jsx(Button, { className: "bg-black text-white h-auto", disabled: actionLoading === rec.id, onClick: () => act(rec.id, "approve"), "aria-label": `Approve KYC for ${rec.store?.name}`, children: actionLoading === rec.id ? "Saving..." : "Approve" })] })] }, rec.id))) }))] }));
}
