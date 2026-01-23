import { useState, useEffect } from "react";
export function useStorefrontStore(slug: any) {
    const [store, setStore] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!slug)
            return;
        let isMounted = true;
        setIsLoading(true);
        fetch(`/api/storefront/${slug}/store`)
            .then((res: any) => {
            if (!res.ok) {
                if (res.status === 404)
                    throw new Error("Store not found");
                throw new Error("Failed to fetch store");
            }
            return res.json();
        })
            .then((data: any) => {
            if (isMounted)
                setStore(data);
        })
            .catch((err: any) => {
            if (isMounted)
                setError(err);
            if (err.message !== "Store not found") {
                console.error("Store fetch error:", err);
            }
        })
            .finally(() => {
            if (isMounted)
                setIsLoading(false);
        });
        return () => {
            isMounted = false;
        };
    }, [slug]);
    return { store, isLoading, error };
}
export function useStorefrontProducts(slug: any, options: any) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // Destructure options to avoid dependency loop if object is unstable
    const category = options?.category;
    const search = options?.search;
    const limit = options?.limit;
    useEffect(() => {
        if (!slug)
            return;
        let isMounted = true;
        setIsLoading(true);
        const query = new URLSearchParams();
        if (category && category !== "all")
            query.append("category", category);
        if (search)
            query.append("search", search);
        if (limit)
            query.append("limit", limit.toString());
        fetch(`/api/storefront/${slug}/products?${query.toString()}`)
            .then((res: any) => {
            if (!res.ok) {
                if (res.status === 404)
                    throw new Error("Store not found");
                throw new Error("Failed to fetch products");
            }
            return res.json();
        })
            .then((data: any) => {
            if (isMounted)
                setProducts(data);
        })
            .catch((err: any) => {
            if (isMounted)
                setError(err);
            if (err.message !== "Store not found") {
                console.error("Products fetch error:", err);
            }
        })
            .finally(() => {
            if (isMounted)
                setIsLoading(false);
        });
        return () => {
            isMounted = false;
        };
    }, [slug, category, search, limit]);
    return { products, isLoading, error };
}
