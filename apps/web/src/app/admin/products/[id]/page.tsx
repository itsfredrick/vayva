'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { ProductForm } from '@/components/product-form';

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;

    // Mock initial data
    const mockData = {
        id,
        name: 'Nike Air Max 90',
        description: 'Iconic sneakers with bubble sole.',
        price: '45000',
        sku: 'NK-AM90-BLK',
        inventory: 12,
        status: 'active'
    };

    return (
        <AdminShell title="Edit Product" breadcrumb={`Catalog / ${id}`}>
            <ProductForm isEdit initialData={mockData} />
        </AdminShell>
    );
}
