import { api } from "./api";

export const StoreService = {
  create: async (data: any) => {


    return {
      id: "store_" + Date.now(),
      ...data,
      settings: { currency: "NGN" },
    };
  },

  update: async (storeId: string, data: any) => {

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
