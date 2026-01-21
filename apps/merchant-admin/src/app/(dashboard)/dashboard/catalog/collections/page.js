"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FolderOpen, Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductPicker } from "@/components/bundles/ProductPicker";
export default function CollectionsPage() {
    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState([]);
    // Dialog State
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState("CREATE");
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({ title: "", handle: "", description: "", productIds: [] });
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        fetchCollections();
    }, []);
    const fetchCollections = async () => {
        try {
            const res = await fetch("/api/collections");
            if (!res.ok)
                throw new Error("Failed to load collections");
            const data = await res.json();
            setCollections(data.data || []);
        }
        catch (error) {
            console.error(error);
            toast.error("Could not load collections");
        }
        finally {
            setLoading(false);
        }
    };
    const handleOpenCreate = () => {
        setMode("CREATE");
        setFormData({ title: "", handle: "", description: "", productIds: [] });
        setCurrentId(null);
        setIsOpen(true);
    };
    const handleOpenEdit = async (col) => {
        setMode("EDIT");
        setFormData({
            title: col.name,
            handle: col.handle,
            description: col.description || "",
            productIds: col.products?.map((p) => p.id) || []
        });
        setCurrentId(col.id);
        setIsOpen(true);
    };
    const handleSubmit = async () => {
        if (!formData.title || !formData.handle)
            return toast.error("Title and Handle are required");
        setSubmitting(true);
        try {
            const url = mode === "CREATE" ? "/api/collections" : `/api/collections/${currentId}`;
            const method = mode === "CREATE" ? "POST" : "PUT";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Operation failed");
            }
            toast.success(mode === "CREATE" ? "Collection created" : "Collection updated");
            setIsOpen(false);
            fetchCollections();
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm("Are you sure? This cannot be undone."))
            return;
        try {
            const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
            if (!res.ok)
                throw new Error("Failed to delete");
            toast.success("Collection deleted");
            fetchCollections();
        }
        catch (error) {
            toast.error("Could not delete collection");
        }
    };
    const generateHandle = (title) => {
        setFormData(prev => ({
            ...prev,
            title,
            handle: mode === "CREATE" ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : prev.handle
        }));
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Collections" }), _jsx("p", { className: "text-slate-500", children: "Organize your products into catalog collections." })] }), _jsxs(Button, { onClick: handleOpenCreate, className: "inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm", children: [_jsx(Plus, { className: "h-4 w-4" }), "Create Collection"] })] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: loading ? (_jsx("div", { className: "p-12 flex justify-center", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-slate-400" }) })) : collections.length === 0 ? (_jsxs("div", { className: "p-16 text-center flex flex-col items-center", children: [_jsx("div", { className: "h-12 w-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4", children: _jsx(FolderOpen, { className: "h-6 w-6" }) }), _jsx("h3", { className: "text-lg font-medium text-slate-900 mb-1", children: "No collections yet" }), _jsx("p", { className: "text-slate-500 max-w-sm mb-6", children: "Create collections to help customers browse your products by category." }), _jsxs(Button, { onClick: handleOpenCreate, className: "inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors", children: [_jsx(Plus, { className: "h-4 w-4" }), "Create your first collection"] })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-slate-50 text-slate-600 font-medium border-b border-slate-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "Title" }), _jsx("th", { className: "px-6 py-3", children: "Products" }), _jsx("th", { className: "px-6 py-3", children: "Visibility" }), _jsx("th", { className: "px-6 py-3", children: "Last Updated" }), _jsx("th", { className: "px-6 py-3 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100", children: collections.map((col) => (_jsxs("tr", { className: "hover:bg-slate-50/50 group", children: [_jsxs("td", { className: "px-6 py-4 font-medium text-slate-900", children: [col.name, _jsxs("span", { className: "block text-xs text-slate-400 font-normal font-mono mt-0.5", children: ["/", col.handle] })] }), _jsxs("td", { className: "px-6 py-4 text-slate-600", children: [col.count, " products"] }), _jsx("td", { className: "px-6 py-4", children: _jsxs("span", { className: "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700", children: [_jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500" }), col.visibility] }) }), _jsx("td", { className: "px-6 py-4 text-slate-500", children: formatDate(col.updated) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { onClick: () => handleOpenEdit(col), className: "p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors", title: "Edit Collection", children: _jsx(Pencil, { className: "h-4 w-4" }) }), _jsx(Button, { onClick: () => handleDelete(col.id), className: "p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors", title: "Delete Collection", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }) })] }, col.id))) })] }) })) }), _jsx(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[600px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: mode === "CREATE" ? "Create Collection" : "Edit Collection" }), _jsx(DialogDescription, { children: "Collections help organize your products." })] }), _jsxs("div", { className: "grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "title", children: "Title" }), _jsx(Input, { id: "title", value: formData.title, onChange: (e) => generateHandle(e.target.value), placeholder: "e.g. Summer Arrivals" })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "handle", children: "Handle (URL)" }), _jsx(Input, { id: "handle", value: formData.handle, onChange: (e) => setFormData({ ...formData, handle: e.target.value }), placeholder: "e.g. summer-arrivals" })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "desc", children: "Description" }), _jsx(Textarea, { id: "desc", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), placeholder: "Optional description for SEO..." })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Products" }), _jsx(ProductPicker, { selectedIds: formData.productIds, onSelectionChange: (ids) => setFormData({ ...formData, productIds: ids }) })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsOpen(false), disabled: submitting, children: "Cancel" }), _jsxs(Button, { onClick: handleSubmit, disabled: submitting, children: [submitting ? _jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : null, "Save Collection"] })] })] }) })] }));
}
