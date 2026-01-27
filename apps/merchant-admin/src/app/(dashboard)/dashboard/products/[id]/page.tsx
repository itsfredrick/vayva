"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import Link from "next/link";
import { ChevronLeft, Save, Trash, Globe } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [product, setProduct] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        inventory: "",
        status: "DRAFT",
    });

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                if (data.error) throw new Error(data.error);

                setProduct(data);
                setFormData({
                    name: data.name,
                    description: data.description || "",
                    price: data.price.toString(),
                    inventory: data.inventory.toString(),
                    status: data.status,
                });
            } catch (err: any) {
                toast.error("Failed to load product");
                router.push("/dashboard/products");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Update failed");

            toast.success("Product updated successfully");
            router.push("/dashboard/products");
        } catch (err: any) {
            toast.error(err.message || "Update failed");
        } finally {
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
        } catch (err: any) {
            toast.error(err.message || "Delete failed");
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };



    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/products">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                    <p className="text-gray-500 text-sm">Update your product details</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button
                        variant="outline"
                        className="text-red-600 border-red-100 hover:bg-red-50"
                        onClick={() => setShowDeleteConfirm(true)}
                        aria-label="Delete product"
                    >
                        <Trash className="h-4 w-4 mr-2" /> Delete
                    </Button>
                    <Button onClick={handleSubmit} disabled={saving}>
                        {saving ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h2 className="font-semibold text-gray-900">Basic Details</h2>
                        <div className="space-y-2">
                            <Label>Product Name</Label>
                            <Input
                                value={(formData.name as any)}
                                onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={(formData.description as any)}
                                onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
                                rows={5}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h2 className="font-semibold text-gray-900">Inventory & Pricing</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Price (NGN)</Label>
                                <Input
                                    type="number"
                                    value={(formData.price as any)}
                                    onChange={(e: any) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Stock Quantity</Label>
                                <Input
                                    type="number"
                                    value={(formData.inventory as any)}
                                    onChange={(e: any) => setFormData({ ...formData, inventory: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h2 className="font-semibold text-gray-900">Status</h2>
                        <select
                            className="w-full p-2 border border-gray-200 rounded-lg"
                            value={(formData.status as any)}
                            aria-label="Product Status"
                            onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="DRAFT">Draft</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                        <p className="text-xs text-gray-500">
                            {formData.status === 'ACTIVE' ? 'Product is visible to customers.' : 'Product is hidden from store.'}
                        </p>
                    </div>

                    {/* Marketplace Coming Soon */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2">
                            <Globe size={16} className="text-gray-400" />
                            <h2 className="font-semibold text-gray-900">Marketplace</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <p className="text-sm text-blue-700">
                                    🚀 <span className="font-medium">Marketplace Coming Soon</span>
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    We're working on an exciting new marketplace experience. Stay tuned for updates!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Image upload functionality will be added in a future update
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h2 className="font-semibold text-gray-900">Images</h2>
                        <div className="aspect-square bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                            Image Upload
                        </div>
                    </div>
                    */}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                loading={deleting}
            />

        </div>
    );
}
