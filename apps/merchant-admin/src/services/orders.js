import { api } from "./api";
export const OrdersService = {
    getOrders: async (filters) => {
        const response = await api.get("/orders", { params: filters });
        return response.data;
    },
    getOrder: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },
    updateStatus: async (id, status, note) => {
        const response = await api.post(`/orders/${id}/status`, { status, note });
        return response.data;
    },
};
