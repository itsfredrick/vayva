import { api } from "./api";

export const StoreService = {
  create: async (data: unknown) => {


    return {
      id: "store_" + Date.now(),
      ...data,
      settings: { currency: "NGN" },
    };
  },

  update: async (storeId: string, data: unknown) => {

    return { id: storeId, ...data };
  },

  get: async (storeId: string) => {

    return {
      id: storeId,
      name: "Test Store",
      settings: { currency: "NGN" },
    };
  },
};
