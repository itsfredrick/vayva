'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlassPanel , Button , Input , Icon } from '@vayva/ui';

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export const ProductForm = ({ initialData, isEdit = false }: ProductFormProps) => {
    const router = useRouter();
    const [hasVariants, setHasVariants] = useState(false);

    // Mock save
    const handleSave = () => {
        // Logic would go here
        router.push('/admin/products');
    };

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-20">
            {/* Sticky Action Bar */}
            <div className="flex items-center justify-between sticky top-[80px] z-30 py-4 bg-[#142210]/95 backdrop-blur-xl border-b border-white/5 -mx-6 px-6 sm:mx-0 sm:px-0 sm:bg-transparent sm:border-none sm:backdrop-blur-none sm:static">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
                    {isEdit && <p className="text-text-secondary text-sm">Last saved a few minutes ago</p>}
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => router.back()}>Discard</Button>
                    <Button onClick={handleSave}>{isEdit ? 'Save Changes' : 'Save Product'}</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Media */}
                    <GlassPanel className="p-6">
                        <h3 className="font-bold text-white mb-4">Media</h3>
                        <div className="border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer">
                            <Icon name="ImagePlus" size={32} className="text-text-secondary mb-2" />
                            <p className="text-sm font-bold text-white">Add images</p>
                            <p className="text-xs text-text-secondary">Drag and drop or click to upload</p>
                        </div>
                    </GlassPanel>

                    {/* Basic Info */}
                    <GlassPanel className="p-6">
                        <h3 className="font-bold text-white mb-4">Basic Info</h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Product Name</label>
                                <Input defaultValue={initialData?.name} placeholder="e.g. Nike Air Max 90" />
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Description</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:outline-none focus:border-primary transition-colors min-h-[120px]"
                                    defaultValue={initialData?.description}
                                    placeholder="Describe your product..."
                                ></textarea>
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Variants Toggle */}
                    <GlassPanel className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white">Variants</h3>
                                <p className="text-sm text-text-secondary">Does this product have options like size or color?</p>
                            </div>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={hasVariants}
                                onChange={(e) => setHasVariants(e.target.checked)}
                            />
                        </div>

                        {hasVariants && (
                            <div className="mt-6 pt-6 border-t border-white/5">
                                {isEdit ? (
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                        <div>
                                            <p className="font-bold text-white">Manage Variants</p>
                                            <p className="text-xs text-text-secondary">Edit sizes, colors, and prices</p>
                                        </div>
                                        <Link href={`/admin/products/${initialData?.id || 'new'}/variants`}>
                                            <Button size="sm" variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                                                Open Editor
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="text-sm text-state-warning bg-state-warning/10 p-4 rounded-xl border border-state-warning/20">
                                        You can configure variants after saving the product for the first time.
                                    </div>
                                )}
                            </div>
                        )}
                    </GlassPanel>
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex flex-col gap-6">
                    {/* Status */}
                    <GlassPanel className="p-6">
                        <h3 className="font-bold text-white mb-4">Status</h3>
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                                <input type="radio" name="status" className="radio radio-primary" defaultChecked={initialData?.status === 'active'} />
                                <span className="label-text text-white">Active</span>
                            </label>
                            <label className="label cursor-pointer justify-start gap-4">
                                <input type="radio" name="status" className="radio radio-primary" defaultChecked={initialData?.status !== 'active'} />
                                <span className="label-text text-white">Draft</span>
                            </label>
                        </div>
                    </GlassPanel>

                    {/* Pricing */}
                    <GlassPanel className="p-6">
                        <h3 className="font-bold text-white mb-4">Pricing</h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Price (₦)</label>
                                <Input defaultValue={initialData?.price} placeholder="0.00" className="font-mono text-lg" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Cost</label>
                                    <Input placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Profit</label>
                                    <div className="h-12 flex items-center px-4 text-text-secondary text-sm border border-transparent">--</div>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Inventory */}
                    <GlassPanel className="p-6">
                        <h3 className="font-bold text-white mb-4">Inventory</h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">SKU (Optional)</label>
                                <Input defaultValue={initialData?.sku} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white text-sm">Track quantity</span>
                                <input type="checkbox" className="toggle toggle-sm toggle-primary" defaultChecked />
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Available Quantity</label>
                                <Input type="number" defaultValue={initialData?.inventory || 0} />
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Organization */}
                    <GlassPanel className="p-6">
                        <h3 className="font-bold text-white mb-4">Organization</h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Category</label>
                                <select className="h-12 w-full rounded-full bg-white/5 border border-white/10 px-4 text-white outline-none focus:border-primary">
                                    <option>Select...</option>
                                    <option>Apparel</option>
                                    <option>Accessories</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Collections</label>
                                <Input placeholder="Search collections..." />
                            </div>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
};
