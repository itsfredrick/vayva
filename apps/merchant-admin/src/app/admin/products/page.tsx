"use client";

import React, { useState, useEffect } from 'react';
import { Icon, Button } from '@vayva/ui';
import { ProductServiceItem } from '@vayva/shared';
import { ProductList } from '@/components/products/ProductList';
import { ProductDrawer } from '@/components/products/ProductDrawer';
import { ProductFormValues } from '@/lib/product-schema';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';

export default function ProductsPage() {
    const [items, setItems] = useState<ProductServiceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ProductServiceItem | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const data = await apiClient.get('/api/products/items');
            setItems(data);
        } catch (e) {
            console.error(e);
            toast.error("Failed to load products");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleCreate = () => {
        setEditingItem(undefined);
        setIsDrawerOpen(true);
    };

    const handleEdit = (item: ProductServiceItem) => {
        setEditingItem(item);
        setIsDrawerOpen(true);
    };

    const handleSubmit = async (data: ProductFormValues) => {
        try {
            if (editingItem) {
                // Update
                const res = await fetch(`/api/products/items/${editingItem.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
                if (!res.ok) throw new Error('Update failed');
                toast.success("Product updated successfully");
            } else {
                // Create
                const res = await fetch('/api/products/items', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                if (!res.ok) throw new Error('Create failed');
                toast.success("Product created successfully");
            }

            setIsDrawerOpen(false);
            fetchItems(); // Refresh
        } catch (e) {
            console.error(e);
            toast.error("Something went wrong");
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            const res = await fetch(`/api/products/items/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            toast.success("Product deleted");
            fetchItems();
        } catch (e) {
            console.error(e);
            toast.error("Failed to delete product");
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Bar */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading font-bold text-2xl text-gray-900">Products</h1>
                    <p className="text-gray-500 text-sm">Manage what you sell and how customers buy</p>
                </div>
                <Button onClick={handleCreate} className="flex items-center gap-2">
                    <Icon name="Plus" size={18} /> Add Product
                </Button>
            </header>

            {/* Content Area */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 min-h-[500px]">

                {/* Search & Filter */}
                <div className="flex items-center justify-between mb-6">
                    <div className="relative w-full max-w-sm">
                        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-300 transition-colors"
                        />
                    </div>
                    {/* Visual Filter - Functional implementation can be added later */}
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <Icon name="Filter" size={16} /> Filter
                    </button>
                </div>

                <ProductList
                    items={filteredItems}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={handleCreate}
                />
            </div>

            <ProductDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingItem}
            />
        </div>
    );
}
