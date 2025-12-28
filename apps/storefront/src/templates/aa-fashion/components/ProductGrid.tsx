import React from 'react';
import { ProductCard } from './ProductCard';
import { PublicProduct } from '@/types/storefront';

interface ProductGridProps {
    products: PublicProduct[];
    storeSlug?: string;
}

export const ProductGrid = ({ products, storeSlug }: ProductGridProps) => {
    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} storeSlug={storeSlug} />
            ))}
        </div>
    );
};
