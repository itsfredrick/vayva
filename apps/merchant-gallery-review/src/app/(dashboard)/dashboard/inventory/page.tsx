"use client";

import { EmptyState, Button } from "@vayva/ui";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function InventoryPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            // Reusing the product item API which returns inventory status
            try {
                const res = await fetch("/api/products/items");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                }
            } catch (e) {
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
                        <Link href="/dashboard/products/new">
                            <Button variant="outline" className="px-8">Add Product</Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Inventory</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Product Name</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((p) => {
                            const stock = p.inventory?.quantity || 0;
                            const lowStock = stock < 5;
                            return (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                                    <td className="px-6 py-4 text-gray-900">{stock} units</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${stock === 0 ? 'bg-red-100 text-red-700' :
                                            lowStock ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {stock === 0 ? "Out of Stock" : lowStock ? "Low Stock" : "In Stock"}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
