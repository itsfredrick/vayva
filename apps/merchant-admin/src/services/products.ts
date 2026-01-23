import { apiClient } from "@/lib/apiClient";
export const ProductsService = {
    // 1. Get Limits
    getLimits: async () => {
        return apiClient.get("/api/products/limits");
    },
    // 2. Get Products
    getProducts: async ({ search, status }: any = {}) => {
        const query = new URLSearchParams();
        if (search)
            query.set("q", search);
        if (status)
            query.set("status", status);
        return apiClient.get(`/api/products/items?${query.toString()}`);
    },
    // 3. Get Single Product
    getProduct: async (id: any) => {
        try {
            return await apiClient.get(`/api/products/items/${id}`);
        }
        catch (e) {
            return null;
        }
    },
    // 4. Create Product
    createProduct: async (data: any) => {
        try {
            const product = await apiClient.post("/api/products/items", data);
            return { success: true, product };
        }
        catch (e: any) {
            return { success: false, error: e.message || "Failed to create product" };
        }
    },
    // 5. Update Product
    updateProduct: async (id: any, data: any) => {
        try {
            return await apiClient.put(`/api/products/items/${id}`, data);
        }
        catch (e) {
            return null;
        }
    },
    // 6. Delete/Archive
    deleteProduct: async (id: any) => {
        try {
            await apiClient.delete(`/api/products/items/${id}`);
            return true;
        }
        catch (e) {
            return false;
        }
    },
};
export const ProductService = ProductsService;
