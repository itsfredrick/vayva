import { api } from "./api";

export const StoreService = {
  create: async (data: any) => {
    console.log("Testing Store Create:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      id: "store_" + Date.now(),
      ...data,
      settings: { currency: "NGN" },
    };
  },

  update: async (storeId: string, data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { id: storeId, ...data };
  },

  get: async (storeId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id: storeId,
      name: "Test Store",
      settings: { currency: "NGN" },
    };
  },
};
