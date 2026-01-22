"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Zap, Plus, Clock, Timer, Loader2, Edit2, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";

interface FlashSale {
    id: string;
    name: string;
    discount: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
    targetType: string;
    targetId: string | null;
}

export default function FlashSalesPage() {
    const [loading, setLoading] = useState(true);
    const [sales, setSales] = useState<FlashSale[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingSale, setEditingSale] = useState<FlashSale | null>(null);

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
            if (!res.ok) throw new Error("Failed to load flash sales");
            const data = await res.json();
            setSales(data.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Could not load flash sales");
        } finally {
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
        } catch (error: unknown) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEndNow = async (id: string) => {
        if (!confirm("Are you sure you want to end this sale immediately?")) return;

        try {
            const res = await fetch(`/api/marketing/flash-sales/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    isActive: false,
                    endTime: new Date().toISOString()
                }),
            });

            if (!res.ok) throw new Error("Failed to end sale");

            toast.success("Sale ended successfully");
            fetchSales();
        } catch (error) {
            toast.error("Could not end sale");
        }
    };

    const handleEdit = (sale: FlashSale) => {
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
        } catch (error: unknown) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this flash sale? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/marketing/flash-sales/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete sale");

            toast.success("Flash sale deleted successfully");
            fetchSales();
        } catch (error) {
            toast.error("Could not delete sale");
        }
    };

    const handleDialogClose = () => {
        setIsOpen(false);
        setEditingSale(null);
        setFormData({ name: "", discount: "20", durationHours: "24" });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Flash Sales</h1>
                    <p className="text-slate-500">Create urgency with time-limited offers.</p>
                </div>
                <Button
                    onClick={() => { setEditingSale(null); setIsOpen(true); }}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                >
                    <Plus className="h-4 w-4" />
                    Create Flash Sale
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                ) : sales.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center">
                        <div className="h-12 w-12 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No active flash sales</h3>
                        <p className="text-slate-500 max-w-sm mb-6">
                            Run a flash sale to clear inventory and boost revenue quickly.
                        </p>
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Create Flash Sale
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                        {sales.map((sale) => {
                            const now = new Date();
                            const start = new Date(sale.startTime);
                            const end = new Date(sale.endTime);
                            const isActive = start <= now && end > now && sale.isActive;
                            const isScheduled = start > now;

                            return (
                                <div key={sale.id} className="border border-slate-200 rounded-lg p-5 hover:bg-slate-50 transition-colors group relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-lg ${isActive ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <Zap className="h-5 w-5" />
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isActive ? 'bg-emerald-100 text-emerald-700' : isScheduled ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {isActive ? 'LIVE' : isScheduled ? 'SCHEDULED' : 'ENDED'}
                                        </span>
                                    </div>

                                    <h3 className="font-semibold text-slate-900 mb-1">{sale.name}</h3>
                                    <p className="text-2xl font-bold text-indigo-600 mb-4">
                                        {sale.discount}% OFF
                                    </p>

                                    <div className="space-y-2 text-sm text-slate-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                {isActive ? `Ends: ${formatDate(sale.endTime)}` : `Starts: ${formatDate(sale.startTime)}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Timer className="h-4 w-4" />
                                            <span>Target: {sale.targetType}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {!isActive && (
                                            <>
                                                <Button
                                                    onClick={() => handleEdit(sale)}
                                                    className="flex-1 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5"
                                                >
                                                    <Edit2 className="h-3.5 w-3.5" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(sale.id)}
                                                    className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                        {isActive && (
                                            <Button
                                                onClick={() => handleEndNow(sale.id)}
                                                className="w-full py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                End Sale Now
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Dialog open={isOpen} onOpenChange={handleDialogClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingSale ? "Edit Flash Sale" : "Create Flash Sale"}</DialogTitle>
                        <DialogDescription>
                            {editingSale ? "Update the flash sale details." : "Launch a time-limited discount for all customers."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Sale Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e: unknown) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Midnight Madness"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="discount">Discount (%)</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={formData.discount}
                                    onChange={(e: unknown) => setFormData({ ...formData, discount: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="duration">Duration (Hours)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    min="1"
                                    value={formData.durationHours}
                                    onChange={(e: unknown) => setFormData({ ...formData, durationHours: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleDialogClose} disabled={isSubmitting}>Cancel</Button>
                        <Button onClick={editingSale ? handleUpdate : handleCreate} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {editingSale ? "Update Sale" : "Launch Sale"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
