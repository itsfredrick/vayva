"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileText, Loader2, CheckCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@vayva/ui";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/FileUpload";
export default function DisputesPage() {
    const [loading, setLoading] = useState(true);
    const [disputes, setDisputes] = useState([]);
    const [evidenceOpen, setEvidenceOpen] = useState(false);
    const [selectedDisputeId, setSelectedDisputeId] = useState(null);
    const [evidenceText, setEvidenceText] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        fetchDisputes();
    }, []);
    const fetchDisputes = async () => {
        try {
            const res = await fetch("/api/support/disputes");
            if (!res.ok)
                throw new Error("Failed to load disputes");
            const result = await res.json();
            setDisputes(result.data || []);
        }
        catch (error) {
            console.error(error);
            toast.error("Could not load disputes");
        }
        finally {
            setLoading(false);
        }
    };
    const handleOpenEvidence = (id) => {
        setSelectedDisputeId(id);
        setEvidenceText("");
        setFileUrl("");
        setEvidenceOpen(true);
    };
    const handleSubmitEvidence = async () => {
        if (!selectedDisputeId || !evidenceText.trim())
            return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/support/disputes/${selectedDisputeId}/evidence`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: evidenceText, fileUrl })
            });
            if (!res.ok)
                throw new Error("Submission failed");
            toast.success("Evidence submitted successfully");
            setEvidenceOpen(false);
            fetchDisputes(); // Refresh status
        }
        catch (e) {
            toast.error("Failed to submit evidence");
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Disputes & Chargebacks" }), _jsx("p", { className: "text-slate-500", children: "Manage payment disputes and submit evidence." })] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: loading ? (_jsx("div", { className: "p-12 flex justify-center", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-slate-400" }) })) : disputes.length === 0 ? (_jsxs("div", { className: "p-16 text-center flex flex-col items-center", children: [_jsx("div", { className: "h-12 w-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4", children: _jsx(CheckCircle, { className: "h-6 w-6" }) }), _jsx("h3", { className: "text-lg font-medium text-slate-900 mb-1", children: "Zero disputes" }), _jsx("p", { className: "text-slate-500 max-w-sm", children: "You have no active chargebacks or disputes requiring attention." })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-slate-50 text-slate-600 font-medium border-b border-slate-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "Order / Customer" }), _jsx("th", { className: "px-6 py-3", children: "Amount" }), _jsx("th", { className: "px-6 py-3", children: "Reason" }), _jsx("th", { className: "px-6 py-3", children: "Evidence Due" }), _jsx("th", { className: "px-6 py-3", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100", children: disputes.map((dispute) => (_jsxs("tr", { className: "hover:bg-slate-50/50 group", children: [_jsxs("td", { className: "px-6 py-4", children: [_jsxs("div", { className: "font-medium text-slate-900", children: ["#", dispute.orderNumber] }), _jsx("div", { className: "text-xs text-slate-500", children: dispute.customerEmail })] }), _jsx("td", { className: "px-6 py-4 font-medium text-slate-900", children: formatCurrency(dispute.amount) }), _jsx("td", { className: "px-6 py-4 text-slate-600", children: dispute.reason }), _jsx("td", { className: "px-6 py-4", children: dispute.dueAt ? (_jsx("span", { className: "text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded", children: formatDate(dispute.dueAt) })) : (_jsx("span", { className: "text-slate-400 text-xs", children: "N/A" })) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${dispute.status === 'OPENED' ? 'bg-red-100 text-red-700' :
                                                    dispute.status === 'WON' ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-slate-100 text-slate-600'}`, children: dispute.status }) }), _jsx("td", { className: "px-6 py-4 text-right", children: dispute.status === 'OPENED' && (_jsxs(Button, { size: "sm", variant: "ghost", onClick: () => handleOpenEvidence(dispute.id), className: "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8", children: [_jsx(FileText, { className: "h-3.5 w-3.5 mr-1.5" }), "Submit Evidence"] })) })] }, dispute.id))) })] }) })) }), _jsx(Dialog, { open: evidenceOpen, onOpenChange: setEvidenceOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Submit Dispute Evidence" }), _jsx(DialogDescription, { children: "Provide detailed information to contest this dispute. This will be sent to the payment provider." })] }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "Explanation & Timeline" }), _jsx(Textarea, { placeholder: "Describe the service/product provided, tracking details, and communication history...", value: evidenceText, onChange: (e) => setEvidenceText(e.target.value), className: "min-h-[150px]" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium leading-none", children: "Supporting Documents" }), _jsx(FileUpload, { value: fileUrl, onChange: setFileUrl, label: "Upload proof of service, tracking, or communication", accept: "image/*,application/pdf" }), _jsx("p", { className: "text-xs text-slate-500", children: "Provide screenshots of delivery confirmation, invoices, or customer chats." })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setEvidenceOpen(false), disabled: submitting, children: "Cancel" }), _jsxs(Button, { onClick: handleSubmitEvidence, disabled: submitting || !evidenceText.trim(), children: [submitting ? _jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : null, "Submit Evidence"] })] })] }) })] }));
}
