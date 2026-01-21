"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Package, Plus, Loader2, Tag, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { ProductPicker } from "@/components/bundles/ProductPicker";
export default function BundlesPage() {
    const [loading, setLoading] = useState(true);
    const [bundles, setBundles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        discount: "10",
        productIds: [],
        startsAt: "",
        endsAt: ""
    });
    useEffect(() => {
        fetchBundles();
    }, []);
    const fetchBundles = async () => {
        try {
            const res = await fetch("/api/marketing/discounts");
            if (!res.ok)
                throw new Error("Failed to load bundles");
            const data = await res.json();
            // Client-side filter: Treat discounts applied to specific products/collections as "Bundles"
            const bundleItems = data.filter((d) => (d.appliesTo === "PRODUCTS" || d.appliesTo === "COLLECTIONS"));
            setBundles(bundleItems);
        }
        catch (error) {
            console.error(error);
            toast.error("Could not load bundles");
        }
        finally {
            setLoading(false);
        }
    };
    const handleSave = async () => {
        if (!formData.name || !formData.discount)
            return toast.error("Please fill all fields");
        if (formData.productIds.length === 0)
            return toast.error("Please select at least one product");
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
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this bundle?"))
            return;
        try {
            const res = await fetch(`/api/marketing/discounts/${id}`, { method: "DELETE" });
            if (!res.ok)
                throw new Error("Delete failed");
            toast.success("Bundle deleted");
            fetchBundles();
        }
        catch (error) {
            toast.error("Failed to delete bundle");
        }
    };
    const handleEdit = (bundle) => {
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Bundles" }), _jsx("p", { className: "text-slate-500", children: "Group products together with special pricing." })] }), _jsxs(Button, { onClick: () => setIsOpen(true), className: "gap-2 bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm", children: [_jsx(Plus, { className: "h-4 w-4" }), "Create Bundle"] })] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: loading ? (_jsx("div", { className: "p-12 flex justify-center", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-slate-400" }) })) : bundles.length === 0 ? (_jsxs("div", { className: "p-16 text-center flex flex-col items-center", children: [_jsx("div", { className: "h-12 w-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4", children: _jsx(Package, { className: "h-6 w-6" }) }), _jsx("h3", { className: "text-lg font-medium text-slate-900 mb-1", children: "No bundles yet" }), _jsx("p", { className: "text-slate-500 max-w-sm mb-6", children: "Bundles help increase average order value by grouping products." }), _jsxs(Button, { onClick: () => setIsOpen(true), variant: "outline", className: "gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm bg-indigo-50 hover:bg-indigo-100 border-indigo-100", children: [_jsx(Plus, { className: "h-4 w-4" }), "Create your first bundle"] })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-slate-50 text-slate-600 font-medium border-b border-slate-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "Bundle Name" }), _jsx("th", { className: "px-6 py-3", children: "Discount" }), _jsx("th", { className: "px-6 py-3", children: "Contents" }), _jsx("th", { className: "px-6 py-3", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100", children: bundles.map((bundle) => {
                                    const isActive = !bundle.endsAt || new Date(bundle.endsAt) > new Date();
                                    return (_jsxs("tr", { className: "hover:bg-slate-50/50 group", children: [_jsx("td", { className: "px-6 py-4 font-medium text-slate-900", children: bundle.name }), _jsx("td", { className: "px-6 py-4 text-slate-600", children: _jsxs("span", { className: "inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium text-xs", children: [_jsx(Tag, { className: "h-3 w-3" }), bundle.valuePercent ? `${bundle.valuePercent}% OFF` : bundle.valueAmount ? `-${formatCurrency(Number(bundle.valueAmount))}` : 'Custom'] }) }), _jsxs("td", { className: "px-6 py-4 text-slate-500", children: [bundle.productIds?.length || 0, " Products"] }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`, children: isActive ? 'Active' : 'Expired' }) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2 text-slate-400", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleEdit(bundle), className: "hover:text-indigo-600 hover:bg-slate-100 rounded-lg h-8 w-8", title: "Edit Bundle", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDelete(bundle.id), className: "hover:text-red-600 hover:bg-slate-100 rounded-lg h-8 w-8", title: "Delete Bundle", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }) })] }, bundle.id));
                                }) })] }) })) }), _jsx(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: formData.id ? "Edit Bundle Offer" : "Create Bundle Offer" }), _jsx(DialogDescription, { children: "Create a discounted price for a group of products." })] }), _jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "name", children: "Bundle Name" }), _jsx(Input, { id: "name", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "e.g. Summer Essentials" })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "discount", children: "Discount Percentage" }), _jsx(Input, { id: "discount", type: "number", min: "1", max: "100", value: formData.discount, onChange: (e) => setFormData({ ...formData, discount: e.target.value }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "startsAt", children: "Start Date" }), _jsx(Input, { id: "startsAt", type: "datetime-local", value: formData.startsAt, onChange: (e) => setFormData({ ...formData, startsAt: e.target.value }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "endsAt", children: "End Date (Optional)" }), _jsx(Input, { id: "endsAt", type: "datetime-local", value: formData.endsAt || "", onChange: (e) => setFormData({ ...formData, endsAt: e.target.value }) })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Products in Bundle" }), _jsx(ProductPicker, { selectedIds: formData.productIds, onSelectionChange: (ids) => setFormData({ ...formData, productIds: ids }) })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsOpen(false), disabled: isSubmitting, children: "Cancel" }), _jsxs(Button, { onClick: handleSave, disabled: isSubmitting, children: [isSubmitting ? _jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : null, formData.id ? "Update Bundle" : "Create Bundle"] })] })] }) })] }));
}
