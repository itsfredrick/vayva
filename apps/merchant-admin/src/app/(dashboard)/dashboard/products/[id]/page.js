"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import Link from "next/link";
import { ChevronLeft, Save, Trash, Globe, ExternalLink } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { PublishMarketplaceDialog } from "@/components/products/PublishMarketplaceDialog";
export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const [product, setProduct] = useState(null);
    const [publishing, setPublishing] = useState(false);
    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        inventory: "",
        status: "DRAFT",
    });
    useEffect(() => {
        if (!id)
            return;
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                if (data.error)
                    throw new Error(data.error);
                setProduct(data);
                setFormData({
                    name: data.name,
                    description: data.description || "",
                    price: data.price.toString(),
                    inventory: data.inventory.toString(),
                    status: data.status,
                });
            }
            catch (err) {
                toast.error("Failed to load product");
                router.push("/dashboard/products");
            }
            finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, router]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || "Update failed");
            toast.success("Product updated successfully");
            router.push("/dashboard/products");
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setSaving(false);
        }
    };
    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Delete failed");
            }
            toast.success("Product deleted successfully");
            router.push("/dashboard/products");
        }
        catch (err) {
            toast.error(err.message);
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };
    const handlePublishToMarketplace = () => {
        setShowPublishDialog(true);
    };
    const handlePublishSuccess = () => {
        // Refresh product data to show "Listed" state
        window.location.reload();
    };
    if (loading) {
        return (_jsx("div", { className: "flex h-96 items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" }) }));
    }
    if (!product)
        return null;
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [_jsxs("div", { className: "flex items-center gap-4 mb-8", children: [_jsx(Link, { href: "/dashboard/products", children: _jsx(Button, { variant: "ghost", size: "icon", children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Edit Product" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Update your product details" })] }), _jsxs("div", { className: "ml-auto flex gap-2", children: [_jsxs(Button, { variant: "outline", className: "text-red-600 border-red-100 hover:bg-red-50", onClick: () => setShowDeleteConfirm(true), "aria-label": "Delete product", children: [_jsx(Trash, { className: "h-4 w-4 mr-2" }), " Delete"] }), _jsx(Button, { onClick: handleSubmit, disabled: saving, children: saving ? "Saving..." : _jsxs(_Fragment, { children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), " Save Changes"] }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [_jsxs("div", { className: "md:col-span-2 space-y-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4", children: [_jsx("h2", { className: "font-semibold text-gray-900", children: "Basic Details" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Product Name" }), _jsx(Input, { value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Description" }), _jsx(Textarea, { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), rows: 5 })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4", children: [_jsx("h2", { className: "font-semibold text-gray-900", children: "Inventory & Pricing" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Price (NGN)" }), _jsx(Input, { type: "number", value: formData.price, onChange: (e) => setFormData({ ...formData, price: e.target.value }), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Stock Quantity" }), _jsx(Input, { type: "number", value: formData.inventory, onChange: (e) => setFormData({ ...formData, inventory: e.target.value }), required: true })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4", children: [_jsx("h2", { className: "font-semibold text-gray-900", children: "Status" }), _jsxs("select", { className: "w-full p-2 border border-gray-200 rounded-lg", value: formData.status, "aria-label": "Product Status", onChange: (e) => setFormData({ ...formData, status: e.target.value }), children: [_jsx("option", { value: "ACTIVE", children: "Active" }), _jsx("option", { value: "DRAFT", children: "Draft" }), _jsx("option", { value: "ARCHIVED", children: "Archived" })] }), _jsx("p", { className: "text-xs text-gray-500", children: formData.status === 'ACTIVE' ? 'Product is visible to customers.' : 'Product is hidden from store.' })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "font-semibold text-gray-900 flex items-center gap-2", children: [_jsx(Globe, { size: 16 }), " Marketplace"] }), product.MarketplaceListing ? (_jsx("span", { className: "text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide", children: "Listed" })) : (_jsx("span", { className: "text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wide", children: "Not Listed" }))] }), product.MarketplaceListing ? (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-sm text-gray-500", children: "This product is active on Vayva Marketplace." }), _jsxs(Link, { href: `http://localhost:3001/listing/${product.MarketplaceListing.id}`, target: "_blank", className: "text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline", children: ["View Listing ", _jsx(ExternalLink, { size: 12 })] }), _jsx(Button, { variant: "outline", className: "w-full text-xs", size: "sm", children: "Manage Listing" })] })) : (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-sm text-gray-500", children: "Reach thousands of new customers by listing this product on Vayva Marketplace." }), _jsx(Button, { className: "w-full bg-[#22C55E] hover:bg-[#1ea851] text-white", onClick: handlePublishToMarketplace, disabled: publishing, children: publishing ? "Publishing..." : "Publish to Marketplace" })] }))] })] })] }), _jsx(ConfirmDialog, { isOpen: showDeleteConfirm, onClose: () => setShowDeleteConfirm(false), onConfirm: handleDelete, title: "Delete Product", message: `Are you sure you want to delete "${product?.name}"? This action cannot be undone.`, confirmText: "Delete", cancelText: "Cancel", variant: "danger", loading: deleting }), product && (_jsx(PublishMarketplaceDialog, { isOpen: showPublishDialog, onClose: () => setShowPublishDialog(false), productId: product.id, productPrice: product.price, onSuccess: handlePublishSuccess }))] }));
}
