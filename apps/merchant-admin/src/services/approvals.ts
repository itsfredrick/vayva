import { api } from './api';

export const ApprovalService = {
    list: async (storeId?: string) => {
        // The api interceptor adds x-store-id header automatically.
        // We pass storeId explicitly only if needed by the backend query param.
        const response = await api.get('/approvals', { params: { storeId } });
        return response.data;
    },

    approve: async (id: string) => {
        const response = await api.post(`/approvals/${id}/approve`, { approverId: 'user' });
        return response.data;
    }
};
