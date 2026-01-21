"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Input } from "@vayva/ui";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
export function BulkProductTable({ initialProducts }) {
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts);
    const [edits, setEdits] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const handleChange = (id, field, value) => {
        setEdits((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
        setProducts((prev) => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };
    const hasChanges = Object.keys(edits).length > 0;
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const itemsToUpdate = Object.entries(edits).map(([id, changes]) => ({
                id,
                data: changes
            }));
            const res = await fetch("/api/products/bulk", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: itemsToUpdate })
            });
            if (!res.ok)
                throw new Error("Bulk update failed");
            const result = await res.json();
            toast.success(result.message);
            setEdits({});
            router.refresh();
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to save changes");
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleDiscard = () => {
        setProducts(initialProducts);
        setEdits({});
        toast.info("Changes discarded");
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between bg-yellow-50 p-4 rounded-lg border border-yellow-100", children: [_jsxs("div", { className: "flex items-center gap-2 text-yellow-800", children: [_jsx("span", { className: "font-semibold", children: "Bulk Edit Mode" }), _jsxs("span", { className: "text-sm", children: ["\u2022 ", Object.keys(edits).length, " unsaverd changes"] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: handleDiscard, disabled: !hasChanges || isSaving, children: "Discard" }), _jsxs(Button, { size: "sm", onClick: handleSave, disabled: !hasChanges || isSaving, children: [isSaving ? _jsx(Loader2, { className: "w-4 h-4 animate-spin mr-2" }) : _jsx(Check, { className: "w-4 h-4 mr-2" }), "Save Changes"] })] })] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-gray-500 font-medium border-b border-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 w-[40%]", children: "Product Name" }), _jsx("th", { className: "px-6 py-4 w-[20%]", children: "Price" }), _jsx("th", { className: "px-6 py-4 w-[20%]", children: "Status" }), _jsx("th", { className: "px-6 py-4 w-[20%]", children: "Currency" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: products.map((p) => {
                                const isDirty = !!edits[p.id];
                                return (_jsxs("tr", { className: `transition-colors ${isDirty ? "bg-blue-50/50" : "hover:bg-gray-50"}`, children: [_jsx("td", { className: "px-6 py-3", children: _jsx(Input, { value: p.name, onChange: (e) => handleChange(p.id, "name", e.target.value), className: "h-8 bg-transparent border-transparent hover:border-gray-200 focus:bg-white" }) }), _jsx("td", { className: "px-6 py-3", children: _jsx(Input, { type: "number", value: p.price, onChange: (e) => handleChange(p.id, "price", e.target.value), className: "h-8 bg-transparent border-transparent hover:border-gray-200 focus:bg-white" }) }), _jsx("td", { className: "px-6 py-3", children: _jsxs("select", { "aria-label": "Status", value: p.status, onChange: (e) => handleChange(p.id, "status", e.target.value), className: "h-8 bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer", children: [_jsx("option", { value: "ACTIVE", children: "ACTIVE" }), _jsx("option", { value: "DRAFT", children: "DRAFT" }), _jsx("option", { value: "ARCHIVED", children: "ARCHIVED" })] }) }), _jsx("td", { className: "px-6 py-3 text-gray-500", children: p.currency })] }, p.id));
                            }) })] }) })] }));
}
