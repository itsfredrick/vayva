import { api } from "@/services/api";
export const WhatsAppService = {
    listThreads: async () => {
        const response = await api.get("/whatsapp/threads");
        return response.data;
    },
    getThread: async (id) => {
        const response = await api.get(`/whatsapp/threads/${id}`);
        return response.data;
    },
    sendMessage: async (conversationId, content) => {
        const response = await api.post(`/whatsapp/threads/${conversationId}/messages`, { content });
        return response.data;
    },
};
