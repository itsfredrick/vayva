import { apiClient } from '@/lib/apiClient';

export interface ProductVariant {
    id: string;
    name: string;
    price: number;
    inventory: number;
    sku: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    status: 'active' | 'draft' | 'archived';
    price: number;
    compareAtPrice?: number;
    inventory: number;
    category: string;
    images: string[];
    variants: ProductVariant[];
    updatedAt: string;
}

export interface ProductLimit {
    used: number;
    limit: number | 'unlimited';
    plan: 'starter' | 'growth' | 'pro';
}

export const ProductsService = {
    // 1. Get Limits (Mock for now, or implement API)
    getLimits: async (): Promise<ProductLimit> => {
        // TODO: Implement real limits API
        return { used: 0, limit: 'unlimited', plan: 'pro' };
    },

    // 2. Get Products
    getProducts: async ({ search, status }: { search?: string, status?: string } = {}): Promise<Product[]> => {
        const query = new URLSearchParams();
        if (search) query.set('q', search);
        if (status) query.set('status', status);
        return apiClient.get(`/api/products/items?${query.toString()}`);
    },

    // 3. Get Single Product
    getProduct: async (id: string): Promise<Product | null> => {
        try {
            return await apiClient.get(`/api/products/items/${id}`);
        } catch (e) {
            return null;
        }
    },

    // 4. Create Product
    createProduct: async (data: Partial<Product>): Promise<{ success: boolean; error?: string; product?: Product }> => {
        try {
            const product = await apiClient.post('/api/products/items', data);
            return { success: true, product };
        } catch (e: any) {
            return { success: false, error: e.message || 'Failed to create product' };
        }
    },

    // 5. Update Product
    updateProduct: async (id: string, data: Partial<Product>): Promise<Product | null> => {
        try {
            return await apiClient.put(`/api/products/items/${id}`, data);
        } catch (e) {
            return null;
        }
    },

    // 6. Delete/Archive
    deleteProduct: async (id: string) => {
        try {
            await apiClient.delete(`/api/products/items/${id}`);
            return true;
        } catch (e) {
            return false;
        }
    }
};

export const ProductService = ProductsService;

