import { api } from "./api";

export const FulfillmentAPI = {
  getProfiles: async (storeId: string) => {
    const response = await api.get(`/delivery/profiles?storeId=${storeId}`);
    return response.data;
  },
  createProfile: async (data: any) => {
    const response = await api.post("/delivery/profiles", data);
    return response.data;
  },
  createZone: async (data: any) => {
    const response = await api.post("/delivery/zones", data);
    return response.data;
  },
  createShipment: async (data: any) => {
    const response = await api.post("/shipments", data);
    return response.data;
  },
  dispatchShipment: async (data: any) => {
    const response = await api.post("/shipments/dispatch", data);
    return response.data;
  },
};
