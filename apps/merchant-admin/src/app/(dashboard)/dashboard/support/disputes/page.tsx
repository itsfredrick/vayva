"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Scale, AlertCircle, FileText, Loader2, CheckCircle, X } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button, Input } from "@vayva/ui";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/FileUpload";
import { cn } from "@/lib/utils";

interface Dispute {
    id: string;
    amount: number;
    currency: string;
    status: string;
    reason: string;
    dueAt: string | null;
    orderNumber: string;
    customerEmail: string;
    createdAt: string;
}

export default function DisputesPage() {
    const [loading, setLoading] = useState(true);
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [evidenceOpen, setEvidenceOpen] = useState(false);
    const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
    const [evidenceText, setEvidenceText] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchDisputes();
    }, []);

    const fetchDisputes = async () => {
        try {
            const res = await fetch("/api/support/disputes");
            if (!res.ok) throw new Error("Failed to load disputes");
            const result = await res.json();
            setDisputes(result.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Could not load disputes");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEvidence = (id: string) => {
        setSelectedDisputeId(id);
        setEvidenceText("");
        setFileUrl("");
        setEvidenceOpen(true);
    };

    const handleSubmitEvidence = async () => {
        if (!selectedDisputeId || !evidenceText.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/support/disputes/${selectedDisputeId}/evidence`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: evidenceText, fileUrl })
            });

            if (!res.ok) throw new Error("Submission failed");

            toast.success("Evidence submitted successfully");
            setEvidenceOpen(false);
            fetchDisputes(); // Refresh status
        } catch (e) {
            toast.error("Failed to submit evidence");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Disputes & Chargebacks</h1>
                <p className="text-slate-500">Manage payment disputes and submit evidence.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                ) : disputes.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center">
                        <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">Zero disputes</h3>
                        <p className="text-slate-500 max-w-sm">
                            You have no active chargebacks or disputes requiring attention.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3">Order / Customer</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Reason</th>
                                    <th className="px-6 py-3">Evidence Due</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {disputes.map((dispute) => (
                                    <tr key={dispute.id} className="hover:bg-slate-50/50 group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">#{dispute.orderNumber}</div>
                                            <div className="text-xs text-slate-500">{dispute.customerEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {formatCurrency(dispute.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {dispute.reason}
                                        </td>
                                        <td className="px-6 py-4">
                                            {dispute.dueAt ? (
                                                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                                    {formatDate(dispute.dueAt)}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${dispute.status === 'OPENED' ? 'bg-red-100 text-red-700' :
                                                dispute.status === 'WON' ? 'bg-emerald-100 text-emerald-700' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                {dispute.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {dispute.status === 'OPENED' && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleOpenEvidence(dispute.id)}
                                                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8"
                                                >
                                                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                                                    Submit Evidence
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Dialog open={evidenceOpen} onOpenChange={setEvidenceOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Submit Dispute Evidence</DialogTitle>
                        <DialogDescription>
                            Provide detailed information to contest this dispute. This will be sent to the payment provider.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Explanation & Timeline
                            </label>
                            <Textarea
                                placeholder="Describe the service/product provided, tracking details, and communication history..."
                                value={evidenceText}
                                onChange={(e: any) => setEvidenceText(e.target.value)}
                                className="min-h-[150px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Supporting Documents
                            </label>
                            <FileUpload
                                value={fileUrl}
                                onChange={setFileUrl}
                                label="Upload proof of service, tracking, or communication"
                                accept="image/*,application/pdf"
                            />
                            <p className="text-xs text-slate-500">Provide screenshots of delivery confirmation, invoices, or customer chats.</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEvidenceOpen(false)} disabled={submitting}>Cancel</Button>
                        <Button onClick={handleSubmitEvidence} disabled={submitting || !evidenceText.trim()}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Submit Evidence
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
