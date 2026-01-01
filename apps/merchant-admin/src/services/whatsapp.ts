import { api } from "./api";

export const WhatsAppService = {
  listConversations: async () => {
    const response = await api.get("/whatsapp/conversations");
    return response.data;
  },

  listMessages: async (conversationId: string) => {
    const response = await api.get(
      `/whatsapp/conversations/${conversationId}/messages`,
    );
    return response.data;
  },

  sendMessage: async (conversationId: string, content: string) => {
    const response = await api.post("/whatsapp/send", {
      conversationId,
      content,
    });
    return response.data;
  },
};
