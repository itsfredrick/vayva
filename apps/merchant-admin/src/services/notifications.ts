import { api } from "./api";

export const NotificationService = {
  list: async (storeId: string, page = 1) => {
    const response = await api.get(`/api/notifications?page=${page}&storeId=${storeId}`);
    return response.data; // { notifications, total, unreadCount }
  },

  markRead: async (id: string, storeId: string) => {
    await api.post(`/api/notifications/mark-read`, { id, storeId });
  },

  markAllRead: async (storeId: string) => {
    await api.post(`/api/notifications/mark-read`, { all: true, storeId });
  }
};
