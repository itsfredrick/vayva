"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Zap, Plus, Clock, Timer, Loader2, Edit2, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
export default function FlashSalesPage() {
    const [loading, setLoading] = useState(true);
    const [sales, setSales] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingSale, setEditingSale] = useState(null);
    // Form State
    const [formData, setFormData] = useState({
        name: "",
        discount: "20",
        durationHours: "24",
    });
    useEffect(() => {
        fetchSales();
    }, []);
    const fetchSales = async () => {
        try {
            const res = await fetch("/api/marketing/flash-sales");
            if (!res.ok)
                throw new Error("Failed to load flash sales");
            const data = await res.json();
            setSales(data.data || []);
        }
        catch (error) {
            console.error(error);
            toast.error("Could not load flash sales");
        }
        finally {
            setLoading(false);
        }
    };
    const handleCreate = async () => {
        if (!formData.name || !formData.discount) {
            toast.error("Please fill in all fields");
            return;
        }
        setIsSubmitting(true);
        try {
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + Number(formData.durationHours) * 60 * 60 * 1000);
            const res = await fetch("/api/marketing/flash-sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    discount: Number(formData.discount),
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    targetType: "ALL"
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create flash sale");
            }
            toast.success("Flash sale created successfully");
            setIsOpen(false);
            setFormData({ name: "", discount: "20", durationHours: "24" }); // Reset
            fetchSales();
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleEndNow = async (id) => {
        if (!confirm("Are you sure you want to end this sale immediately?"))
            return;
        try {
            const res = await fetch(`/api/marketing/flash-sales/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    isActive: false,
                    endTime: new Date().toISOString()
                }),
            });
            if (!res.ok)
                throw new Error("Failed to end sale");
            toast.success("Sale ended successfully");
            fetchSales();
        }
        catch (error) {
            toast.error("Could not end sale");
        }
    };
    const handleEdit = (sale) => {
        setEditingSale(sale);
        const start = new Date(sale.startTime);
        const end = new Date(sale.endTime);
        const durationHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
        setFormData({
            name: sale.name,
            discount: sale.discount.toString(),
            durationHours: durationHours.toString()
        });
        setIsOpen(true);
    };
    const handleUpdate = async () => {
        if (!editingSale || !formData.name || !formData.discount) {
            toast.error("Please fill in all fields");
            return;
        }
        setIsSubmitting(true);
        try {
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + Number(formData.durationHours) * 60 * 60 * 1000);
            const res = await fetch(`/api/marketing/flash-sales/${editingSale.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    discount: Number(formData.discount),
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to update flash sale");
            }
            toast.success("Flash sale updated successfully");
            setIsOpen(false);
            setEditingSale(null);
            setFormData({ name: "", discount: "20", durationHours: "24" });
            fetchSales();
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this flash sale? This action cannot be undone."))
            return;
        try {
            const res = await fetch(`/api/marketing/flash-sales/${id}`, {
                method: "DELETE",
            });
            if (!res.ok)
                throw new Error("Failed to delete sale");
            toast.success("Flash sale deleted successfully");
            fetchSales();
        }
        catch (error) {
            toast.error("Could not delete sale");
        }
    };
    const handleDialogClose = () => {
        setIsOpen(false);
        setEditingSale(null);
        setFormData({ name: "", discount: "20", durationHours: "24" });
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Flash Sales" }), _jsx("p", { className: "text-slate-500", children: "Create urgency with time-limited offers." })] }), _jsxs(Button, { onClick: () => { setEditingSale(null); setIsOpen(true); }, className: "inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm", children: [_jsx(Plus, { className: "h-4 w-4" }), "Create Flash Sale"] })] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: loading ? (_jsx("div", { className: "p-12 flex justify-center", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-slate-400" }) })) : sales.length === 0 ? (_jsxs("div", { className: "p-16 text-center flex flex-col items-center", children: [_jsx("div", { className: "h-12 w-12 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center mb-4", children: _jsx(Zap, { className: "h-6 w-6" }) }), _jsx("h3", { className: "text-lg font-medium text-slate-900 mb-1", children: "No active flash sales" }), _jsx("p", { className: "text-slate-500 max-w-sm mb-6", children: "Run a flash sale to clear inventory and boost revenue quickly." }), _jsxs(Button, { onClick: () => setIsOpen(true), className: "inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors", children: [_jsx(Plus, { className: "h-4 w-4" }), "Create Flash Sale"] })] })) : (_jsx("div", { className: "grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3", children: sales.map((sale) => {
                        const now = new Date();
                        const start = new Date(sale.startTime);
                        const end = new Date(sale.endTime);
                        const isActive = start <= now && end > now && sale.isActive;
                        const isScheduled = start > now;
                        return (_jsxs("div", { className: "border border-slate-200 rounded-lg p-5 hover:bg-slate-50 transition-colors group relative", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("div", { className: `p-2 rounded-lg ${isActive ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`, children: _jsx(Zap, { className: "h-5 w-5" }) }), _jsx("span", { className: `text-xs font-bold px-2 py-1 rounded-full ${isActive ? 'bg-emerald-100 text-emerald-700' : isScheduled ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`, children: isActive ? 'LIVE' : isScheduled ? 'SCHEDULED' : 'ENDED' })] }), _jsx("h3", { className: "font-semibold text-slate-900 mb-1", children: sale.name }), _jsxs("p", { className: "text-2xl font-bold text-indigo-600 mb-4", children: [sale.discount, "% OFF"] }), _jsxs("div", { className: "space-y-2 text-sm text-slate-500 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsx("span", { children: isActive ? `Ends: ${formatDate(sale.endTime)}` : `Starts: ${formatDate(sale.startTime)}` })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Timer, { className: "h-4 w-4" }), _jsxs("span", { children: ["Target: ", sale.targetType] })] })] }), _jsxs("div", { className: "flex gap-2", children: [!isActive && (_jsxs(_Fragment, { children: [_jsxs(Button, { onClick: () => handleEdit(sale), className: "flex-1 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5", children: [_jsx(Edit2, { className: "h-3.5 w-3.5" }), "Edit"] }), _jsxs(Button, { onClick: () => handleDelete(sale.id), className: "flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5", children: [_jsx(Trash2, { className: "h-3.5 w-3.5" }), "Delete"] })] })), isActive && (_jsx(Button, { onClick: () => handleEndNow(sale.id), className: "w-full py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100", children: "End Sale Now" }))] })] }, sale.id));
                    }) })) }), _jsx(Dialog, { open: isOpen, onOpenChange: handleDialogClose, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: editingSale ? "Edit Flash Sale" : "Create Flash Sale" }), _jsx(DialogDescription, { children: editingSale ? "Update the flash sale details." : "Launch a time-limited discount for all customers." })] }), _jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "name", children: "Sale Name" }), _jsx(Input, { id: "name", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "e.g. Midnight Madness" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "discount", children: "Discount (%)" }), _jsx(Input, { id: "discount", type: "number", min: "1", max: "100", value: formData.discount, onChange: (e) => setFormData({ ...formData, discount: e.target.value }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "duration", children: "Duration (Hours)" }), _jsx(Input, { id: "duration", type: "number", min: "1", value: formData.durationHours, onChange: (e) => setFormData({ ...formData, durationHours: e.target.value }) })] })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: handleDialogClose, disabled: isSubmitting, children: "Cancel" }), _jsxs(Button, { onClick: editingSale ? handleUpdate : handleCreate, disabled: isSubmitting, children: [isSubmitting ? _jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : null, editingSale ? "Update Sale" : "Launch Sale"] })] })] }) })] }));
}
