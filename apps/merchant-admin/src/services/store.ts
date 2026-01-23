export interface Store {
    id: string;
    name: string;
    settings: {
        currency: string;
    };
    [key: string]: any;
}

export const StoreService = {
    create: async (data: Partial<Store>): Promise<Store> => {
        return {
            id: "store_" + Date.now(),
            name: data.name || "New Store",
            settings: { currency: "NGN" },
            ...data,
        };
    },
    update: async (storeId: string, data: Partial<Store>): Promise<Store> => {
        return { id: storeId, name: "Updated Store", settings: { currency: "NGN" }, ...data };
    },
    get: async (storeId: string): Promise<Store> => {
        return {
            id: storeId,
            name: "Test Store",
            settings: { currency: "NGN" },
        };
    },
};
