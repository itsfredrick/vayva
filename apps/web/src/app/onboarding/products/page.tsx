'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Stepper } from '@/components/ui/stepper';
import { Icon } from '@/components/ui/icon';

type ProductRow = {
    id: number;
    name: string;
    price: string;
    stock: string;
};

export default function ProductsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<ProductRow[]>([
        { id: 1, name: '', price: '', stock: '10' }
    ]);

    const addRow = () => {
        setProducts([...products, { id: Date.now(), name: '', price: '', stock: '10' }]);
    };

    const updateRow = (id: number, field: keyof ProductRow, value: string) => {
        setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const removeRow = (id: number) => {
        if (products.length === 1) return;
        setProducts(products.filter(p => p.id !== id));
    };

    const handleSave = async () => {
        // Validate
        const hasValidProduct = products.some(p => p.name && p.price);
        if (!hasValidProduct) return;

        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsLoading(false);
        router.push('/onboarding/payments');
    };

    return (
        <AdminShell mode="onboarding" breadcrumb="Onboarding / Products">
            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Add your first products</h1>
                        <p className="text-text-secondary">Let&apos;s stock up your store.</p>
                    </div>
                    <Stepper currentStep={4} />
                </div>

                <GlassPanel className="p-8">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-xs text-text-secondary uppercase">
                                    <th className="py-3 pl-4">Product Name</th>
                                    <th className="py-3 w-32">Price (₦)</th>
                                    <th className="py-3 w-24">Stock</th>
                                    <th className="py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="p-2">
                                            <Input
                                                placeholder="e.g. Summer Dress"
                                                value={p.name}
                                                onChange={e => updateRow(p.id, 'name', e.target.value)}
                                                className="bg-transparent border-transparent focus:bg-background-dark focus:border-white/10 h-10"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                placeholder="0.00"
                                                value={p.price}
                                                onChange={e => updateRow(p.id, 'price', e.target.value)}
                                                className="bg-transparent border-transparent focus:bg-background-dark focus:border-white/10 h-10"
                                                type="number"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                placeholder="Qty"
                                                value={p.stock}
                                                onChange={e => updateRow(p.id, 'stock', e.target.value)}
                                                className="bg-transparent border-transparent focus:bg-background-dark focus:border-white/10 h-10"
                                                type="number"
                                            />
                                        </td>
                                        <td className="p-2 text-center">
                                            <button
                                                onClick={() => removeRow(p.id)}
                                                className="text-white/20 hover:text-state-danger transition-colors opacity-0 group-hover:opacity-100"
                                                disabled={products.length === 1}
                                            >
                                                <Icon name="delete" size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4">
                        <Button variant="ghost" onClick={addRow} className="text-primary hover:text-primary pl-2">
                            + Add another product
                        </Button>
                    </div>
                </GlassPanel>

                <div className="flex justify-between">
                    <Button variant="ghost" onClick={() => router.back()}>Back</Button>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="text-text-secondary">Skip for now</Button>
                        <Button
                            onClick={handleSave}
                            disabled={!products.some(p => p.name && p.price)}
                            isLoading={isLoading}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
