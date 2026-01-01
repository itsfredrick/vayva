import { api } from "./api";

export const AuditService = {
  list: async () => {
    const response = await api.get("/audit");
    return response.data;
  },
};
