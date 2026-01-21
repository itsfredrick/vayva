"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
export function PublishMarketplaceDialog({ isOpen, onClose, productId, productPrice, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingCats, setLoadingCats] = useState(true);
    const [form, setForm] = useState({
        categoryId: "",
        mode: "CHECKOUT",
        price: productPrice.toString()
    });
    useEffect(() => {
        if (isOpen && categories.length === 0) {
            fetchCategories();
        }
    }, [isOpen]);
    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/marketplace/categories");
            const data = await res.json();
            if (Array.isArray(data)) {
                setCategories(data);
            }
        }
        catch (err) {
            toast.error("Failed to load categories");
        }
        finally {
            setLoadingCats(false);
        }
    };
    const handlePublish = async () => {
        if (!form.categoryId) {
            toast.error("Please select a category");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${productId}/publish`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categoryId: form.categoryId,
                    mode: form.mode,
                    price: parseFloat(form.price)
                })
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || "Publish failed");
            toast.success("Product published to Marketplace!");
            onSuccess();
            onClose();
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: _jsxs(DialogContent, { className: "sm:max-w-md", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Publish to Marketplace" }) }), _jsx("div", { className: "space-y-4 py-4", children: loadingCats ? (_jsx("div", { className: "flex justify-center p-4", children: _jsx(Loader2, { className: "animate-spin text-gray-400" }) })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Listing Type" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs(Button, { type: "button", onClick: () => setForm({ ...form, mode: "CHECKOUT" }), className: `p-3 text-sm font-medium rounded-lg border text-center transition-colors ${form.mode === "CHECKOUT"
                                                    ? "border-black bg-black text-white"
                                                    : "border-gray-200 hover:bg-gray-50 text-gray-700"}`, children: ["\uD83D\uDED2 Checkout", _jsx("span", { className: "block text-[10px] font-normal opacity-80 mt-0.5", children: "Buy Now Button" })] }), _jsxs(Button, { type: "button", onClick: () => setForm({ ...form, mode: "CLASSIFIED" }), className: `p-3 text-sm font-medium rounded-lg border text-center transition-colors ${form.mode === "CLASSIFIED"
                                                    ? "border-blue-600 bg-blue-600 text-white"
                                                    : "border-gray-200 hover:bg-gray-50 text-gray-700"}`, children: ["\uD83D\uDCAC Classified", _jsx("span", { className: "block text-[10px] font-normal opacity-80 mt-0.5", children: "Chat / Negotiate" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Category" }), _jsxs("select", { className: "w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black", value: form.categoryId, "aria-label": "Category", onChange: (e) => setForm({ ...form, categoryId: e.target.value }), children: [_jsx("option", { value: "", children: "Select a category..." }), categories.map((cat) => (_jsx("optgroup", { label: cat.name, children: cat.children?.map((child) => (_jsx("option", { value: child.id, children: child.name }, child.id))) }, cat.id)))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Listing Price (NGN)" }), _jsx(Input, { type: "number", value: form.price, onChange: (e) => setForm({ ...form, price: e.target.value }) }), _jsx("p", { className: "text-xs text-gray-500", children: "You can set a different price for the marketplace." })] })] })) }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: onClose, disabled: loading, children: "Cancel" }), _jsxs(Button, { onClick: handlePublish, disabled: loading || loadingCats, children: [loading && _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Publish Listing"] })] })] }) }));
}
