export const StoreService = {
    create: async (data) => {
        return {
            id: "store_" + Date.now(),
            ...data,
            settings: { currency: "NGN" },
        };
    },
    update: async (storeId, data) => {
        return { id: storeId, ...data };
    },
    get: async (storeId) => {
        return {
            id: storeId,
            name: "Test Store",
            settings: { currency: "NGN" },
        };
    },
};
