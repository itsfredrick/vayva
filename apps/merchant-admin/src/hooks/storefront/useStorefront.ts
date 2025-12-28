import { useState, useEffect } from 'react';

export interface StoreData {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    settings: any;
    category: string;
    plan: string;
    isLive: boolean;
    waAgentSettings?: {
        enabled: boolean;
        businessHours: any;
    };
    deliverySettings?: {
        isEnabled: boolean;
        provider: string;
        pickupAddressLine1?: string;
        pickupCity?: string;
        pickupState?: string;
        pickupPhone?: string;
    };
}

export interface ProductData {
    id: string;
    name: string;
    description: string | null;
    price: number;
    originalPrice: number | null;
    image: string | null;
    category: string | null;
    rating: number;
    tags?: string[];
}

export function useStorefrontStore(slug?: string) {
    const [store, setStore] = useState<StoreData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!slug) return;

        let isMounted = true;
        setIsLoading(true);

        fetch(`/api/storefront/${slug}/store`)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) throw new Error('Store not found');
                    throw new Error('Failed to fetch store');
                }
                return res.json();
            })
            .then(data => {
                if (isMounted) setStore(data);
            })
            .catch(err => {
                if (isMounted) setError(err);
                if (err.message !== 'Store not found') {
                    console.error('Store fetch error:', err);
                }
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, [slug]);

    return { store, isLoading, error };
}

export function useStorefrontProducts(slug?: string, options?: { category?: string, search?: string, limit?: number }) {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Destructure options to avoid dependency loop if object is unstable
    const category = options?.category;
    const search = options?.search;
    const limit = options?.limit;

    useEffect(() => {
        if (!slug) return;

        let isMounted = true;
        setIsLoading(true);

        const query = new URLSearchParams();
        if (category && category !== 'all') query.append('category', category);
        if (search) query.append('search', search);
        if (limit) query.append('limit', limit.toString());

        fetch(`/api/storefront/${slug}/products?${query.toString()}`)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) throw new Error('Store not found');
                    throw new Error('Failed to fetch products');
                }
                return res.json();
            })
            .then(data => {
                if (isMounted) setProducts(data);
            })
            .catch(err => {
                if (isMounted) setError(err);
                if (err.message !== 'Store not found') {
                    console.error('Products fetch error:', err);
                }
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, [slug, category, search, limit]);

    return { products, isLoading, error };
}
