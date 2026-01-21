"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AlertTriangle, Phone, RefreshCw, Loader2, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import { Button } from "@vayva/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
export default function DeliveryIssuesPage() {
    const [loading, setLoading] = useState(true);
    const [issues, setIssues] = useState([]);
    // Evidence State
    const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [evidenceFile, setEvidenceFile] = useState(null);
    const [evidenceNote, setEvidenceNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        fetchIssues();
    }, []);
    const fetchIssues = async () => {
        try {
            const res = await fetch("/api/fulfillment/shipments?issue=true");
            if (!res.ok)
                throw new Error("Failed to load delivery issues");
            const result = await res.json();
            setIssues(result.data || []);
        }
        catch (error) {
            console.error(error);
            toast.error("Could not load delivery issues");
        }
        finally {
            setLoading(false);
        }
    };
    const handleAction = async (action, shipment) => {
        const toastId = toast.loading(`${action} initiating...`);
        try {
            if (action === 'Retry') {
                const res = await fetch(`/api/fulfillment/shipments/${shipment.id}/retry`, {
                    method: "POST"
                });
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || "Retry failed");
                }
                toast.success("Retry initiated successfully", { id: toastId });
                fetchIssues(); // Refresh list
                return;
            }
            // Support Call remains as Ticket for now
            const subject = `Support Call Request - #${shipment.orderNumber}`;
            const description = `Merchant requested a support call regarding shipment for order #${shipment.orderNumber}. Issue: ${shipment.status}`;
            const res = await fetch("/api/support/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "FULFILLMENT_ISSUE",
                    subject,
                    description,
                    priority: "high",
                    metadata: {
                        shipmentId: shipment.id,
                        orderId: shipment.orderId,
                        orderNumber: shipment.orderNumber
                    }
                })
            });
            if (!res.ok)
                throw new Error("Failed to create ticket");
            toast.success("Support call request submitted", { id: toastId });
        }
        catch (error) {
            console.error(error);
            toast.error(error.message || `Failed to initiate ${action}`, { id: toastId });
        }
    };
    const handleOpenEvidence = (shipment) => {
        setSelectedShipment(shipment);
        setEvidenceFile(null);
        setEvidenceNote("");
        setIsEvidenceOpen(true);
    };
    const handleSubmitEvidence = async () => {
        if (!selectedShipment || !evidenceFile)
            return;
        setIsSubmitting(true);
        const toastId = toast.loading("Uploading evidence...");
        try {
            // 1. Upload File
            const formData = new FormData();
            formData.append("file", evidenceFile);
            formData.append("folder", "evidence");
            const uploadRes = await fetch("/api/storage/upload", {
                method: "POST",
                body: formData
            });
            if (!uploadRes.ok)
                throw new Error("Upload failed");
            const { url } = await uploadRes.json();
            // 2. Submit Ticket
            const res = await fetch("/api/support/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "FULFILLMENT_EVIDENCE",
                    subject: `Evidence for Order #${selectedShipment.orderNumber}`,
                    description: evidenceNote || "Attached evidence for delivery issue.",
                    priority: "high",
                    metadata: {
                        shipmentId: selectedShipment.id,
                        orderId: selectedShipment.orderId,
                        evidenceUrl: url
                    }
                })
            });
            if (!res.ok)
                throw new Error("Ticket submission failed");
            toast.success("Evidence submitted successfully", { id: toastId });
            setIsEvidenceOpen(false);
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to submit evidence", { id: toastId });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Delivery Issues" }), _jsx("p", { className: "text-slate-500", children: "Resolve delivery exceptions and failed attempts." })] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: loading ? (_jsx("div", { className: "p-12 flex justify-center", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-slate-400" }) })) : issues.length === 0 ? (_jsxs("div", { className: "p-16 text-center flex flex-col items-center", children: [_jsx("div", { className: "h-12 w-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4", children: _jsx(CheckCircle, { className: "h-6 w-6" }) }), _jsx("h3", { className: "text-lg font-medium text-slate-900 mb-1", children: "All clear!" }), _jsx("p", { className: "text-slate-500 max-w-sm", children: "There are no active delivery exceptions or failed shipments." })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-slate-50 text-slate-600 font-medium border-b border-slate-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "Order" }), _jsx("th", { className: "px-6 py-3", children: "Issue Type" }), _jsx("th", { className: "px-6 py-3", children: "Carrier" }), _jsx("th", { className: "px-6 py-3", children: "Last Update" }), _jsx("th", { className: "px-6 py-3 text-right", children: "Resolution" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100", children: issues.map((shipment) => (_jsxs("tr", { className: "hover:bg-slate-50/50 group", children: [_jsxs("td", { className: "px-6 py-4", children: [_jsxs(Link, { href: `/dashboard/orders/${shipment.orderId}`, className: "font-medium text-indigo-600 hover:underline", children: ["#", shipment.orderNumber] }), _jsx("div", { className: "text-xs text-slate-500 mt-0.5", children: shipment.recipientName })] }), _jsx("td", { className: "px-6 py-4", children: _jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200", children: [_jsx(AlertTriangle, { className: "h-3 w-3" }), shipment.status.replace("_", " ")] }) }), _jsxs("td", { className: "px-6 py-4 text-slate-600", children: [shipment.courierName || shipment.provider, _jsx("div", { className: "text-xs text-slate-400 font-mono mt-0.5", children: shipment.trackingCode })] }), _jsx("td", { className: "px-6 py-4 text-slate-500 text-xs", children: formatDate(shipment.updatedAt) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsxs(Button, { size: "sm", variant: "outline", onClick: () => handleAction('Retry', shipment), className: "text-slate-600 hover:text-indigo-600 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-medium border-slate-200 h-8", children: [_jsx(RefreshCw, { className: "h-3.5 w-3.5" }), "Retry"] }), _jsx(Button, { size: "icon", variant: "outline", onClick: () => handleAction('Support Call', shipment), className: "text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border-slate-200 h-8 w-8", title: "Contact Support", children: _jsx(Phone, { className: "h-3.5 w-3.5" }) }), _jsx(Button, { size: "icon", variant: "outline", onClick: () => handleOpenEvidence(shipment), className: "text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border-slate-200 h-8 w-8", title: "Provide Evidence", children: _jsx(CheckCircle, { className: "h-3.5 w-3.5" }) })] }) })] }, shipment.id))) })] }) })) }), _jsx(Dialog, { open: isEvidenceOpen, onOpenChange: setIsEvidenceOpen, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Submit Evidence" }), _jsx(DialogDescription, { children: "Upload proof of delivery or screenshots to resolve this issue." })] }), _jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx("label", { className: "text-sm font-medium text-gray-700", children: "Additional Notes" }), _jsx("textarea", { className: "flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", placeholder: "Describe the evidence...", value: evidenceNote, onChange: (e) => setEvidenceNote(e.target.value) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx("label", { htmlFor: "evidence-file", className: "text-sm font-medium text-gray-700", children: "Attachment" }), _jsx("input", { id: "evidence-file", type: "file", accept: "image/*,.pdf", title: "Upload Evidence", "aria-label": "Upload Evidence", onChange: (e) => setEvidenceFile(e.target.files?.[0] || null), className: "block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "ghost", onClick: () => setIsEvidenceOpen(false), disabled: isSubmitting, className: "text-slate-700 hover:bg-slate-100 font-medium", children: "Cancel" }), _jsxs(Button, { onClick: handleSubmitEvidence, disabled: isSubmitting || !evidenceFile, className: "text-white bg-indigo-600 hover:bg-indigo-700 font-medium flex items-center gap-2", children: [isSubmitting && _jsx(Loader2, { className: "h-4 w-4 animate-spin" }), "Submit Evidence"] })] })] }) })] }));
}
