import { api } from "@/services/api";
import { WhatsAppConversation, WhatsAppMessage } from "@/types/whatsapp";

export const WhatsAppService = {
    listThreads: async (): Promise<WhatsAppConversation[]> => {
        const response = await api.get("/whatsapp/threads");
        return response.data;
    },
    getThread: async (id: string): Promise<WhatsAppConversation> => {
        const response = await api.get(`/whatsapp/threads/${id}`);
        return response.data;
    },
    sendMessage: async (conversationId: string, content: string): Promise<WhatsAppMessage> => {
        const response = await api.post(`/whatsapp/threads/${conversationId}/messages`, { content });
        return response.data;
    },
};
