import { api } from './api';

export interface OrderItem {
    id: string;
    title: string;
    variantId?: string;
    quantity: number;
    price: number;
    image?: string;
}

export interface OrderTimelineEvent {
    id: string;
    type: string;
    text: string;
    createdAt: string;
    metadata?: any;
}

export interface Order {
    id: string;
    refCode: string;
    status: string;
    paymentStatus: string;
    fulfillmentStatus: string;
    createdAt: string;
    customer: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    items: OrderItem[];
    subtotal: number;
    shippingTotal: number;
    total: number;
    channel: string;
    timeline: OrderTimelineEvent[];
    paymentMethod?: string;
    transactionReference?: string;
    deliveryTask?: {
        id: string;
        status: string;
        riderName?: string;
        trackingUrl?: string;
    };
    shippingAddress?: {
        street: string;
        city: string;
        state: string;
        country: string;
    };
}

export const OrdersService = {
    getOrders: async (filters: any): Promise<Order[]> => {
        const response = await api.get('/orders', { params: filters });
        return response.data;
    },

    getOrder: async (id: string): Promise<Order | null> => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    updateStatus: async (id: string, status: string, note?: string) => {
        const response = await api.post(`/orders/${id}/status`, { status, note });
        return response.data;
    }
};

