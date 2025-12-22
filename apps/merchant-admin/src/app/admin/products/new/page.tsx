'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { ProductsService, Product } from '@/services/products';
import { Button, Icon, cn } from '@vayva/ui';

export default function AddProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [inventory, setInventory] = useState('');
    const [status, setStatus] = useState<'active' | 'draft'>('active');

    // Simple Variant UI State
    const [hasVariants, setHasVariants] = useState(false);
    const [variants, setVariants] = useState<{ name: string, price: string, qty: string }[]>([]);

    const handleSave = async () => {
        setIsLoading(true);
        const productData: Partial<Product> = {
            name,
            description,
            price: Number(price),
            inventory: Number(inventory),
            status,
            variants: variants.map(v => ({
                id: Math.random().toString(36),
                name: v.name,
                price: Number(v.price),
                inventory: Number(v.qty),
                sku: ''
            }))
        };

        const res = await ProductsService.createProduct(productData);
        if (res.success) {
            router.push('/admin/products');
        } else {
            alert(res.error); // Simple error handling for prototype
        }
        setIsLoading(false);
    };

    const addVariant = () => {
        setVariants([...variants, { name: '', price: price, qty: '0' }]);
    };

    return (
        <AdminShell title="Add Product" breadcrumb="Products">
            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto pb-24 items-start">

                {/* Main Content */}
                <div className="flex-1 w-full space-y-6">

                    {/* Basics */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-[#0B0B0B]">Basic Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                                placeholder="e.g. Vintage Denim Jacket"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/5"
                                placeholder="Describe your product..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-[#0B0B0B]">Media</h3>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Icon name={"UploadCloud" as any} className="w-8 h-8 mb-4 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-[#0B0B0B]">Pricing & Inventory</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₦</span>
                                    <input
                                        type="number"
                                        className="w-full h-10 pl-8 pr-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                                        placeholder="0.00"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Inventory</label>
                                <input
                                    type="number"
                                    className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                                    placeholder="0"
                                    value={inventory}
                                    onChange={e => setInventory(e.target.value)}
                                    disabled={hasVariants}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="hasVariants"
                                className="w-4 h-4 accent-black"
                                checked={hasVariants}
                                onChange={e => setHasVariants(e.target.checked)}
                            />
                            <label htmlFor="hasVariants" className="text-sm text-gray-700 font-medium cursor-pointer">This product has variants (e.g. size, color)</label>
                        </div>
                    </div>

                    {/* Variants */}
                    {hasVariants && (
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-[#0B0B0B]">Variants</h3>
                                <Button size="sm" variant="outline" onClick={addVariant}>Add Option</Button>
                            </div>
                            {variants.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4">Add variants to manage stock individually.</p>
                            ) : (
                                <div className="space-y-3">
                                    {variants.map((v, i) => (
                                        <div key={i} className="flex gap-4 items-center">
                                            <input
                                                type="text"
                                                placeholder="Option Name (e.g. Size M)"
                                                className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm"
                                                value={v.name}
                                                onChange={e => {
                                                    const newV = [...variants];
                                                    newV[i].name = e.target.value;
                                                    setVariants(newV);
                                                }}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                className="w-24 h-10 px-3 border border-gray-200 rounded-lg text-sm"
                                                value={v.price}
                                                onChange={e => {
                                                    const newV = [...variants];
                                                    newV[i].price = e.target.value;
                                                    setVariants(newV);
                                                }}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Qty"
                                                className="w-20 h-10 px-3 border border-gray-200 rounded-lg text-sm"
                                                value={v.qty}
                                                onChange={e => {
                                                    const newV = [...variants];
                                                    newV[i].qty = e.target.value;
                                                    setVariants(newV);
                                                }}
                                            />
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                                            >
                                                <Icon name={"Trash" as any} size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 shrink-0 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-[#0B0B0B]">Publishing</h3>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    name="status"
                                    checked={status === 'active'}
                                    onChange={() => setStatus('active')}
                                    className="accent-black w-4 h-4"
                                />
                                <span className="text-sm font-medium">Active</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    name="status"
                                    checked={status === 'draft'}
                                    onChange={() => setStatus('draft')}
                                    className="accent-black w-4 h-4"
                                />
                                <span className="text-sm font-medium">Draft</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-40 lg:pl-20">
                    <div className="max-w-6xl mx-auto flex justify-end gap-4">
                        <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                        <Button className="bg-black text-white hover:bg-gray-800" onClick={handleSave} disabled={!name}>
                            {isLoading ? 'Saving...' : 'Save Product'}
                        </Button>
                    </div>
                </div>

            </div>
        </AdminShell>
    );
}
