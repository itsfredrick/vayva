'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { ProductForm } from '@/components/product-form';

export default function AddProductPage() {
    return (
        <AdminShell title="Add Product" breadcrumb="Catalog / New">
            <ProductForm />
        </AdminShell>
    );
}
