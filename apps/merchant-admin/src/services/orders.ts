import { api } from "./api";
export const OrdersService = {
    getOrders: async (filters: unknown) => {
        const response = await api.get("/orders", { params: filters });
        return response.data;
    },
    getOrder: async (id: unknown) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },
    updateStatus: async (id: unknown, status: unknown, note: unknown) => {
        const response = await api.post(`/orders/${id}/status`, { status, note });
        return response.data;
    },
};
