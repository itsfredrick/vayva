'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { ProductsService, Product } from '@/services/products';
import { Button, Icon, cn } from '@vayva/ui';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await ProductsService.getProduct(params.id);
            setProduct(data);
            setIsLoading(false);
        };
        load();
    }, [params.id]);

    if (isLoading) return <AdminShell title="Loading..."><div className="p-12 text-center">Loading Product...</div></AdminShell>;
    if (!product) return <AdminShell title="Not Found"><div className="p-12 text-center">Product not found.</div></AdminShell>;

    return (
        <AdminShell title={product.name} breadcrumb="Products">
            <div className="max-w-6xl mx-auto pb-24 space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            {product.images[0] ? <img src={product.images[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Icon name={"Image" as any} className="text-gray-300" /></div>}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[#0B0B0B]">{product.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-bold", product.status === 'active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                                    {product.status}
                                </span>
                                <span className="text-xs text-gray-400">SKU: {product.variants[0]?.sku || '-'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="text-red-500 hover:bg-red-50 border-red-200">Archive</Button>
                        <Button onClick={() => router.push(`/admin/products/${product.id}/edit`)}>Edit Product</Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Price</p>
                        <p className="text-lg font-bold">₦ {product.price.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Inventory</p>
                        <p className="text-lg font-bold">{product.inventory}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Variants</p>
                        <p className="text-lg font-bold">{product.variants.length > 0 ? product.variants.length : 'None'}</p>
                    </div>
                </div>

                {/* Variants Table */}
                {product.variants.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-[#0B0B0B]">Variants</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Variant</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Inventory</th>
                                    <th className="px-6 py-3">SKU</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {product.variants.map(v => (
                                    <tr key={v.id}>
                                        <td className="px-6 py-4 font-medium">{v.name}</td>
                                        <td className="px-6 py-4">₦ {v.price.toLocaleString()}</td>
                                        <td className="px-6 py-4">{v.inventory}</td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">{v.sku || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </AdminShell>
    );
}
