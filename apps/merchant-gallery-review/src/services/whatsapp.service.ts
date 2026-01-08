import { api } from "@/services/api";

export interface WhatsAppMessage {
  id: string;
  direction: "INBOUND" | "OUTBOUND";
  type: string;
  content: string; // or textBody
  status: string;
  createdAt: string;
}

export interface WhatsAppThread {
  id: string;
  status: string;
  unreadCount: number;
  lastMessageAt: string;
  contact: {
    id: string;
    displayName: string;
    phoneE164: string;
  };
  messages: WhatsAppMessage[];
}

export const WhatsAppService = {
  listThreads: async (): Promise<WhatsAppThread[]> => {
    const response = await api.get("/whatsapp/threads");
    return response.data;
  },

  getThread: async (id: string): Promise<WhatsAppThread> => {
    const response = await api.get(`/whatsapp/threads/${id}`);
    return response.data;
  },

  sendMessage: async (
    conversationId: string,
    content: string,
  ): Promise<WhatsAppMessage> => {
    const response = await api.post(
      `/whatsapp/threads/${conversationId}/messages`,
      { content },
    );
    return response.data;
  },
};
