
"use client";

import { Button, EmptyState } from "@vayva/ui";
import { useEffect, useState } from "react";
import { RefreshCw, Phone } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { BulkActions, bulkExportAction } from "@/components/BulkActions";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/lib/core/permissions";

interface Product {
    id: string;
    name: string;
    inventory?: {
        quantity: number;
    };
    price: number;
    category?: string;
}

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleAction = async (action: 'Retry' | 'Support Help', product: Product) => {
        const toastId = toast.loading(`${action} initiating...`);
        try {
            const res = await fetch("/api/support/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "INVENTORY_ISSUE",
                    subject: `${action}: ${product.name}`,
                    description: `Support request for ${product.name} (ID: ${product.id}). Stock: ${product.inventory?.quantity || 0}`,
                    priority: "medium",
                    metadata: { productId: product.id }
                })
            });
            if (!res.ok) throw new Error("API error");
            toast.success(`${action} request logged with support.`, { id: toastId });
        } catch (error) {
            toast.error(`Failed to initiate ${action}`, { id: toastId });
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === products.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map(p => p.id));
        }
    };

    const handleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkExport = () => {
        const selectedProducts = products.filter(p => selectedIds.includes(p.id));
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Product Name,Stock,Status\n"
            + selectedProducts.map(p => `${p.name},${p.inventory?.quantity || 0},${p.inventory?.quantity === 0 ? "Out of Stock" : "In Stock"}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "inventory_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Exported ${selectedIds.length} items`);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products/items");
                const response = await res.json() as any;

                // Handle new API response structure { data: [...], meta: {...} }
                if (response.data && Array.isArray(response.data)) {
                    setProducts(response.data);
                } else if (Array.isArray(response)) {
                    // Fallback for backward compatibility
                    setProducts(response);
                }
            } catch (e: unknown) {
                console.error("Failed to load inventory", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="p-6">Loading inventory...</div>;

    if (products.length === 0) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Inventory</h1>
                <EmptyState
                    title="No inventory tracked"
                    icon="Boxes"
                    description="Track stock levels to avoid overselling. Enable inventory tracking on your products."
                    action={
                        <Link href="/dashboard/menu-items/new">
                            <Button variant="outline" className="px-8">Add Product</Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <PermissionGate permission={PERMISSIONS.PRODUCTS_VIEW}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Inventory</h1>

                <BulkActions
                    selectedCount={selectedIds.length}
                    totalCount={products.length}
                    allSelected={selectedIds.length === products.length && products.length > 0}
                    onSelectAll={handleSelectAll}
                    onDeselectAll={() => setSelectedIds([])}
                    actions={[
                        bulkExportAction(handleBulkExport)
                    ]}
                />

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 w-12">
                                    <input
                                        type="checkbox"
                                        title="Select all products"
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={selectedIds.length === products.length && products.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((p) => {
                                const stock = p.inventory?.quantity || 0;
                                const lowStock = stock < 5;
                                const isSelected = selectedIds.includes(p.id);
                                return (
                                    <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-indigo-50/30' : ''}`}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                title={`Select ${p.name}`}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                checked={isSelected}
                                                onChange={() => handleSelectOne(p.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                                        <td className="px-6 py-4 text-gray-900">{stock} units</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${stock === 0 ? 'bg-red-100 text-red-700' :
                                                lowStock ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {stock === 0 ? "Out of Stock" : lowStock ? "Low Stock" : "In Stock"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleAction('Retry', p)}
                                                    className="text-gray-500 hover:text-indigo-600 hover:bg-gray-100 border-gray-200 h-8 w-8"
                                                    title="Retry Stock Sync"
                                                >
                                                    <RefreshCw size={14} />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleAction('Support Help', p)}
                                                    className="text-gray-500 hover:text-indigo-600 hover:bg-gray-100 border-gray-200 h-8 w-8"
                                                    title="Contact Support"
                                                >
                                                    <Phone size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </PermissionGate>
    );
}
