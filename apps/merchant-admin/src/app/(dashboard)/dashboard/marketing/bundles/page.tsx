"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Package, Plus, MoreHorizontal, Loader2, Tag, Edit, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { ProductPicker } from "@/components/bundles/ProductPicker";

interface DiscountRule {
    id: string;
    name: string;
    type: string;
    valueAmount: number | null;
    valuePercent: number | null;
    appliesTo: string;
    startsAt: string;
    endsAt: string | null;
    productIds: string[];
}

export default function BundlesPage() {
    const [loading, setLoading] = useState(true);
    const [bundles, setBundles] = useState<DiscountRule[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        discount: "10",
        productIds: [] as string[],
        startsAt: "",
        endsAt: ""
    });

    useEffect(() => {
        fetchBundles();
    }, []);

    const fetchBundles = async () => {
        try {
            const res = await fetch("/api/marketing/discounts");
            if (!res.ok) throw new Error("Failed to load bundles");
            const data = await res.json();
            // Client-side filter: Treat discounts applied to specific products/collections as "Bundles"
            const bundleItems = data.filter((d: unknown) =>
                (d.appliesTo === "PRODUCTS" || d.appliesTo === "COLLECTIONS")
            );
            setBundles(bundleItems);
        } catch (error) {
            console.error(error);
            toast.error("Could not load bundles");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.discount) return toast.error("Please fill all fields");
        if (formData.productIds.length === 0) return toast.error("Please select at least one product");

        setIsSubmitting(true);
        try {
            const isEdit = !!formData.id;
            const res = await fetch(isEdit ? `/api/marketing/discounts/${formData.id}` : "/api/marketing/discounts", {
                method: isEdit ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    type: "PERCENT",
                    valuePercent: Number(formData.discount),
                    appliesTo: "PRODUCTS",
                    startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : new Date().toISOString(),
                    endsAt: formData.endsAt ? new Date(formData.endsAt).toISOString() : null,
                    productIds: formData.productIds
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || `Failed to ${isEdit ? "update" : "create"} bundle`);
            }

            toast.success(`Bundle ${isEdit ? "updated" : "created"} successfully`);
            setIsOpen(false);
            setFormData({ id: "", name: "", discount: "10", productIds: [], startsAt: "", endsAt: "" });
            fetchBundles();
        } catch (error: unknown) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this bundle?")) return;
        try {
            const res = await fetch(`/api/marketing/discounts/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            toast.success("Bundle deleted");
            fetchBundles();
        } catch (error) {
            toast.error("Failed to delete bundle");
        }
    };

    const handleEdit = (bundle: DiscountRule) => {
        setFormData({
            id: bundle.id,
            name: bundle.name,
            discount: (bundle.valuePercent || bundle.valueAmount || 0).toString(),
            productIds: bundle.productIds,
            startsAt: bundle.startsAt ? new Date(bundle.startsAt).toISOString().slice(0, 16) : "",
            endsAt: bundle.endsAt ? new Date(bundle.endsAt).toISOString().slice(0, 16) : ""
        });
        setIsOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bundles</h1>
                    <p className="text-slate-500">Group products together with special pricing.</p>
                </div>
                <Button
                    onClick={() => setIsOpen(true)}
                    className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm"
                >
                    <Plus className="h-4 w-4" />
                    Create Bundle
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                ) : bundles.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center">
                        <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                            <Package className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No bundles yet</h3>
                        <p className="text-slate-500 max-w-sm mb-6">
                            Bundles help increase average order value by grouping products.
                        </p>
                        <Button
                            onClick={() => setIsOpen(true)}
                            variant="outline"
                            className="gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm bg-indigo-50 hover:bg-indigo-100 border-indigo-100"
                        >
                            <Plus className="h-4 w-4" />
                            Create your first bundle
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3">Bundle Name</th>
                                    <th className="px-6 py-3">Discount</th>
                                    <th className="px-6 py-3">Contents</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bundles.map((bundle) => {
                                    const isActive = !bundle.endsAt || new Date(bundle.endsAt) > new Date();
                                    return (
                                        <tr key={bundle.id} className="hover:bg-slate-50/50 group">
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {bundle.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium text-xs">
                                                    <Tag className="h-3 w-3" />
                                                    {bundle.valuePercent ? `${bundle.valuePercent}% OFF` : bundle.valueAmount ? `-${formatCurrency(Number(bundle.valueAmount))}` : 'Custom'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {bundle.productIds?.length || 0} Products
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {isActive ? 'Active' : 'Expired'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 text-slate-400">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(bundle)}
                                                        className="hover:text-indigo-600 hover:bg-slate-100 rounded-lg h-8 w-8"
                                                        title="Edit Bundle"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(bundle.id)}
                                                        className="hover:text-red-600 hover:bg-slate-100 rounded-lg h-8 w-8"
                                                        title="Delete Bundle"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{formData.id ? "Edit Bundle Offer" : "Create Bundle Offer"}</DialogTitle>
                        <DialogDescription>
                            Create a discounted price for a group of products.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Bundle Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e: unknown) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Summer Essentials"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="discount">Discount Percentage</Label>
                            <Input
                                id="discount"
                                type="number"
                                min="1"
                                max="100"
                                value={formData.discount}
                                onChange={(e: unknown) => setFormData({ ...formData, discount: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="startsAt">Start Date</Label>
                                <Input
                                    id="startsAt"
                                    type="datetime-local"
                                    value={formData.startsAt}
                                    onChange={(e: unknown) => setFormData({ ...formData, startsAt: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="endsAt">End Date (Optional)</Label>
                                <Input
                                    id="endsAt"
                                    type="datetime-local"
                                    value={formData.endsAt || ""}
                                    onChange={(e: unknown) => setFormData({ ...formData, endsAt: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Products in Bundle</Label>
                            <ProductPicker
                                selectedIds={formData.productIds}
                                onSelectionChange={(ids) => setFormData({ ...formData, productIds: ids })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {formData.id ? "Update Bundle" : "Create Bundle"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
