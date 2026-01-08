"use client";

import { EmptyState, Button } from "@vayva/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products/items");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                }
            } catch (e) {
                console.error("Failed to load products", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
                    <div className="h-10 w-32 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="h-12 bg-gray-50 border-b border-gray-100" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-16 border-b border-gray-100 flex items-center px-6 gap-8">
                            <div className="h-4 w-48 bg-gray-50 rounded animate-pulse" />
                            <div className="h-4 w-24 bg-gray-50 rounded animate-pulse" />
                            <div className="h-6 w-20 bg-gray-50 rounded-full animate-pulse ml-auto" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Products</h1>
                <EmptyState
                    title="Add your first product"
                    icon="Package"
                    description="You haven't added any products yet. Start selling by adding your inventory."
                    action={
                        <Link href="/dashboard/products/new">
                            <Button className="px-8">Add Product</Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <Link href="/dashboard/products/new">
                    <Button>Add Product</Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/products/${p.id}`)}>
                                <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                                <td className="px-6 py-4 text-gray-900">{p.currency} {p.price.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {p.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile FAB */}
            <div className="fixed bottom-20 right-6 md:hidden">
                <Link href="/dashboard/products/new">
                    <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-primary text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
