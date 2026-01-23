"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FolderOpen, Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductPicker } from "@/components/bundles/ProductPicker";

interface Collection {
    id: string;
    name: string;
    handle: string;
    count: number;
    visibility: string;
    updated: string;
    description?: string;
    products?: { id: string }[];
}

export default function CollectionsPage() {
    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState<Collection[]>([]);

    // Dialog State
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"CREATE" | "EDIT">("CREATE");
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: "", handle: "", description: "", productIds: [] as string[] });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const res = await fetch("/api/collections");
            if (!res.ok) throw new Error("Failed to load collections");
            const data = await res.json();
            setCollections(data.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Could not load collections");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setMode("CREATE");
        setFormData({ title: "", handle: "", description: "", productIds: [] });
        setCurrentId(null);
        setIsOpen(true);
    };

    const handleOpenEdit = async (col: Collection) => {
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
        if (!formData.title || !formData.handle) return toast.error("Title and Handle are required");

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
        } catch (error) {
            toast.error(error.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This cannot be undone.")) return;

        try {
            const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success("Collection deleted");
            fetchCollections();
        } catch (error) {
            toast.error("Could not delete collection");
        }
    };

    const generateHandle = (title: string) => {
        setFormData(prev => ({
            ...prev,
            title,
            handle: mode === "CREATE" ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : prev.handle
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Collections</h1>
                    <p className="text-slate-500">Organize your products into catalog collections.</p>
                </div>
                <Button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                >
                    <Plus className="h-4 w-4" />
                    Create Collection
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                ) : collections.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center">
                        <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                            <FolderOpen className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No collections yet</h3>
                        <p className="text-slate-500 max-w-sm mb-6">
                            Create collections to help customers browse your products by category.
                        </p>
                        <Button
                            onClick={handleOpenCreate}
                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Create your first collection
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3">Title</th>
                                    <th className="px-6 py-3">Products</th>
                                    <th className="px-6 py-3">Visibility</th>
                                    <th className="px-6 py-3">Last Updated</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {collections.map((col) => (
                                    <tr key={col.id} className="hover:bg-slate-50/50 group">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {col.name}
                                            <span className="block text-xs text-slate-400 font-normal font-mono mt-0.5">/{col.handle}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {col.count} products
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                {col.visibility}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {formatDate(col.updated)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={() => handleOpenEdit(col)}
                                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                    title="Edit Collection"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(col.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete Collection"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{mode === "CREATE" ? "Create Collection" : "Edit Collection"}</DialogTitle>
                        <DialogDescription>
                            Collections help organize your products.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => generateHandle(e.target.value)}
                                placeholder="e.g. Summer Arrivals"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="handle">Handle (URL)</Label>
                            <Input
                                id="handle"
                                value={formData.handle}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, handle: e.target.value })}
                                placeholder="e.g. summer-arrivals"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="desc">Description</Label>
                            <Textarea
                                id="desc"
                                value={formData.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Optional description for SEO..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Products</Label>
                            <ProductPicker
                                selectedIds={formData.productIds}
                                onSelectionChange={(ids) => setFormData({ ...formData, productIds: ids })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={submitting}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Save Collection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
