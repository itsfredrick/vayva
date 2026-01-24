import { api } from "./api";
export const OrdersService = {
    getOrders: async (filters: any) => {
        const response = await api.get("/orders", { params: filters });
        return response.data;
    },
    getOrder: async (id: any) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },
    updateStatus: async (id: any, status: any, note: any) => {
        const response = await api.post(`/orders/${id}/status`, { status, note });
        return response.data;
    },
};
