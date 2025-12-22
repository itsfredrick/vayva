'use client';

import React, { useState } from 'react';
import { Button, Input, Icon } from '@vayva/ui';
import { useOnboarding } from '@/context/OnboardingContext';
import { useAuth } from '@/context/AuthContext';
import { ProductService } from '@/services/products';

interface ProductRow {
    id: string; // temp id
    name: string;
    price: string;
    stock: string;
}

export default function ProductsPage() {
    const { updateState, goToStep } = useOnboarding();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const [products, setProducts] = useState<ProductRow[]>([
        { id: '1', name: '', price: '', stock: '10' }
    ]);

    const plan = (user as any)?.plan || 'starter';
    const isStarter = (user as any)?.plan === 'starter';
    const maxProducts = plan === 'starter' ? 5 : plan === 'growth' ? 20 : 999;
    const isLimitReached = products.length >= maxProducts;

    const addRow = () => {
        if (isLimitReached) return;
        setProducts([...products, { id: Date.now().toString(), name: '', price: '', stock: '10' }]);
    };

    const removeRow = (id: string) => {
        if (products.length === 1) return;
        setProducts(products.filter(p => p.id !== id));
    };

    const updateRow = (id: string, field: keyof ProductRow, value: string) => {
        setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleContinue = async () => {
        setLoading(true);
        try {
            // Filter out empty rows
            const validProducts = products.filter(p => p.name.trim() !== '');

            if (validProducts.length > 0) {
                // Bulk create loop (naive for V1)
                for (const p of validProducts) {
                    await ProductService.createProduct({
                        name: p.name,
                        price: parseFloat(p.price) || 0,
                        stock: parseInt(p.stock) || 0,
                        description: 'Added during onboarding',
                        sku: `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
                    } as any);
                }
            }

            await updateState({
                products: {
                    hasAddedProducts: validProducts.length > 0,
                    count: validProducts.length
                }
            });
            await goToStep('payments');
        } catch (err) {
            console.error('Failed to create products', err);
            // Non-blocking error for now
            await goToStep('payments');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-black mb-2">Add your first products</h1>
                    <p className="text-gray-600">Get your store ready for launch. You can import more later.</p>
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-1 text-xs font-medium text-gray-600">
                    {products.length} / {maxProducts === 999 ? 'Unlimited' : maxProducts} used
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-6">Product Name</div>
                    <div className="col-span-3">Price (NGN)</div>
                    <div className="col-span-2">Stock</div>
                    <div className="col-span-1"></div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-gray-100">
                    {products.map((product, index) => (
                        <div key={product.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center group">
                            <div className="col-span-6">
                                <Input
                                    value={product.name}
                                    onChange={(e) => updateRow(product.id, 'name', e.target.value)}
                                    placeholder="e.g. Classic T-Shirt"
                                    className="!h-10 text-sm"
                                />
                            </div>
                            <div className="col-span-3">
                                <Input
                                    value={product.price}
                                    onChange={(e) => updateRow(product.id, 'price', e.target.value)}
                                    type="number"
                                    placeholder="0.00"
                                    className="!h-10 text-sm"
                                />
                            </div>
                            <div className="col-span-2">
                                <Input
                                    value={product.stock}
                                    onChange={(e) => updateRow(product.id, 'stock', e.target.value)}
                                    type="number"
                                    className="!h-10 text-sm"
                                />
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <button
                                    onClick={() => removeRow(product.id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                    disabled={products.length === 1}
                                >
                                    <Icon name="Trash2" size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={addRow}
                        disabled={isLimitReached}
                        className="text-black hover:bg-white border border-transparent hover:border-gray-200"
                    >
                        <Icon name="Plus" size={16} className="mr-2" />
                        Add Another Product
                    </Button>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4">
                <Button variant="ghost" onClick={() => goToStep('templates')}>Back</Button>
                <div className="flex gap-4">
                    <Button variant="ghost" className="text-gray-500" onClick={() => handleContinue()}>
                        Skip for now
                    </Button>
                    <Button
                        onClick={handleContinue}
                        className="!bg-black !text-white px-8 rounded-xl h-12"
                        isLoading={loading}
                    >
                        Continue
                        <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
