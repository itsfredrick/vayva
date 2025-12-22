'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { ProductsService, Product, ProductLimit } from '@/services/products';
import { Button, Icon, cn } from '@vayva/ui';

export default function ProductsListPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [limits, setLimits] = useState<ProductLimit | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [pData, lData] = await Promise.all([
            ProductsService.getProducts(),
            ProductsService.getLimits()
        ]);
        setProducts(pData.map(p => ({ ...p, trackInventory: (p as any).trackInventory ?? false })));
        setLimits(lData);
        setIsLoading(false);
    };

    const isLimitReached = limits ? (limits.limit !== 'unlimited' && limits.used >= limits.limit) : false;

    // Filtering logic (client side for speed demo)
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminShell title="Products">
            <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-24">

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <Icon name={"Search" as any} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 h-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline"><Icon name={"Upload" as any} size={16} className="mr-2" /> Import</Button>
                        <Link href={isLimitReached ? '/admin/account/subscription' : '/admin/products/new'}>
                            <Button disabled={isLimitReached} className={cn(isLimitReached && "opacity-50 cursor-not-allowed")}>
                                <Icon name={"Plus" as any} size={16} className="mr-2" /> Add Product
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Limit Banner */}
                {isLimitReached && (
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Icon name={"AlertTriangle" as any} className="text-orange-500" size={20} />
                            <div>
                                <p className="text-sm font-bold text-orange-800">Product Limit Reached</p>
                                <p className="text-xs text-orange-600">You have reached the limit of {limits?.limit} products on your {limits?.plan} plan.</p>
                            </div>
                        </div>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white border-none">Upgrade Plan</Button>
                    </div>
                )}

                {/* Empty State */}
                {/* This empty state is now handled by the conditional return above */}
                {/* {!isLoading && products.length === 0 && (
                    <div className="bg-white border border-gray-100 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Icon name="Package" size={32} className="text-gray-300" />
                        </div>
                        <h3 className="font-bold text-[#0B0B0B] mb-2">No products yet</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-sm">Add your first product to start selling properly on your Vayva store.</p>
                        <Link href="/admin/products/new"><Button>Add Product</Button></Link>
                    </div>
                )} */}

                {/* Products Table */}
                {!isLoading && products.length > 0 && (
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4 w-16">Image</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Inventory</th>
                                    <th className="px-6 py-4 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map(product => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                        onClick={() => router.push(`/admin/products/${product.id}`)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                                                {product.images[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                                                {!product.images[0] && <div className="w-full h-full flex items-center justify-center"><Icon name={"Image" as any} size={14} className="text-gray-300" /></div>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-[#0B0B0B]">
                                            {product.name}
                                            <div className="text-[10px] text-gray-400 font-normal">{product.variants.length} variants</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide",
                                                product.status === 'active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                            )}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {product.inventory} <span className="text-xs text-gray-400">in stock</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-[#0B0B0B]">
                                            ₦ {product.price.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="text-center text-xs text-gray-400">
                    {limits && (
                        <span>Showing {filteredProducts.length} of {limits.used} used ({limits.limit === 'unlimited' ? 'Unlimited' : limits.limit} available)</span>
                    )}
                </div>

            </div>
        </AdminShell>
    );
}
