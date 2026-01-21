"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import useSWR from "swr";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { fetcher } from "@/lib/utils";
export function VariantManager({ productId, variantLabel = "Variants" }) {
    const { data: variants, mutate, error } = useSWR(`/api/products/${productId}/variants`, fetcher);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null); // If null, create mode
    const [formData, setFormData] = useState({
        name: "", // Option value e.g. "Small" (will be title)
        price: "",
        sku: "",
        stock: "0"
    });
    const handleOpen = (variant) => {
        if (variant) {
            setEditingVariant(variant);
            setFormData({
                name: variant.title,
                price: variant.price || "",
                sku: variant.sku || "",
                stock: variant.inventory?.toString() || "0"
            });
        }
        else {
            setEditingVariant(null);
            setFormData({ name: "", price: "", sku: "", stock: "0" });
        }
        setIsDialogOpen(true);
    };
    const handleSave = async () => {
        try {
            const payload = {
                title: formData.name,
                options: [{ name: variantLabel, value: formData.name }], // Simple 1-dim variant for now
                price: formData.price,
                sku: formData.sku,
                stock: formData.stock
            };
            const url = editingVariant
                ? `/api/products/${productId}/variants/${editingVariant.id}`
                : `/api/products/${productId}/variants`;
            const method = editingVariant ? "PATCH" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok)
                throw new Error("Failed to save variant");
            toast.success(editingVariant ? "Variant updated" : "Variant added");
            setIsDialogOpen(false);
            mutate();
        }
        catch (err) {
            toast.error("Error saving variant");
        }
    };
    const handleDelete = async (id) => {
        if (!confirm("Are you sure?"))
            return;
        try {
            await fetch(`/api/products/${productId}/variants/${id}`, { method: "DELETE" });
            toast.success("Variant deleted");
            mutate();
        }
        catch (err) {
            toast.error("Failed to delete");
        }
    };
    if (error)
        return _jsx("div", { className: "text-red-500", children: "Failed to load variants" });
    return (_jsxs("div", { className: "w-full", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: variantLabel }), _jsxs(Button, { size: "sm", onClick: () => handleOpen(), children: ["Add ", variantLabel] })] }), _jsx("div", { className: "border rounded-md overflow-hidden bg-white", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "p-3", children: "Name" }), _jsx(TableHead, { className: "p-3", children: "Price" }), _jsx(TableHead, { className: "p-3", children: "SKU" }), _jsx(TableHead, { className: "p-3", children: "Stock" }), _jsx(TableHead, { className: "p-3 text-right", children: "Actions" })] }) }), _jsxs(TableBody, { children: [variants?.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, className: "p-6 text-center text-gray-400", children: "No variants yet. Add one to get started." }) })), variants?.map((v) => (_jsxs(TableRow, { className: "hover:bg-gray-50", children: [_jsx(TableCell, { className: "p-3 font-medium", children: v.title }), _jsx(TableCell, { className: "p-3", children: v.price }), _jsx(TableCell, { className: "p-3 text-gray-500", children: v.sku || "-" }), _jsx(TableCell, { className: "p-3", children: v.inventory }), _jsxs(TableCell, { className: "p-3 text-right flex justify-end gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleOpen(v), children: "Edit" }), _jsx(Button, { variant: "ghost", size: "sm", className: "text-red-500", onClick: () => handleDelete(v.id), children: _jsx(Trash, { size: 16 }) })] })] }, v.id)))] })] }) }), _jsx(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsxs(DialogTitle, { children: [editingVariant ? "Edit" : "Add", " ", variantLabel] }) }), _jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Name / Value (e.g. Small, Red)" }), _jsx(Input, { value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "e.g. XL" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Price" }), _jsx(Input, { type: "number", value: formData.price, onChange: (e) => setFormData({ ...formData, price: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "SKU" }), _jsx(Input, { value: formData.sku, onChange: (e) => setFormData({ ...formData, sku: e.target.value }) })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Stock On Hand" }), _jsx(Input, { type: "number", value: formData.stock, onChange: (e) => setFormData({ ...formData, stock: e.target.value }), placeholder: "0" }), editingVariant && _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Adjusting this will create an inventory log." })] })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "ghost", onClick: () => setIsDialogOpen(false), children: "Cancel" }), _jsx(Button, { onClick: handleSave, children: "Save" })] })] }) })] }));
}
