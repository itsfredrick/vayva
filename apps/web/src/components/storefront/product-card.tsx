import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

export interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    slug: string;
    inStock: boolean;
    category?: string;
}

interface ProductCardProps {
    product: Product;
    storeSlug: string;
}

export function ProductCard({ product, storeSlug }: ProductCardProps) {
    return (
        <div className="group relative">
            <Link href={`/store/${storeSlug}/products/${product.id}`} className="block">
                <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-white/5 relative">
                    {/* Image Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center text-white/10 group-hover:scale-105 transition-transform duration-500">
                        {product.image ? (
                            // In real app, use Next Image
                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
                        ) : (
                            <Icon name="image" size={48} />
                        )}
                    </div>

                    {/* Quick Add Overlay (Desktop) */}
                    <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                        <Button
                            className="w-full bg-primary text-black font-bold shadow-lg hover:bg-primary/90 border-none"
                            onClick={(e) => {
                                e.preventDefault();
                                alert('Added to cart!');
                            }}
                        >
                            Quick Add
                        </Button>
                    </div>

                    {!product.inStock && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-bold text-white uppercase tracking-wider">
                            Out of Stock
                        </div>
                    )}
                </div>
                <div className="mt-3">
                    <h3 className="text-sm font-medium text-white group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-sm font-bold text-white/80">{product.price}</p>
                </div>
            </Link>
        </div>
    );
}
