import { api } from "./api";
import { apiClient } from "@vayva/api-client";

export const AuthService = {
  login: async (credentials: any) => {
    try {
      return await apiClient.auth.login(credentials);
    } catch (error: any) {
      // NO TEST FALLBACK - Fail cleanly if backend unavailable
      if (error.message === "Request failed") {
        throw new Error(
          "Authentication service unavailable. Please try again later.",
        );
      }
      throw error;
    }
  },

  getProfile: async () => {
    return await apiClient.auth.me();
  },

  register: async (payload: any) => {
    try {
      return await apiClient.auth.register(payload);
    } catch (error: any) {
      if (error.message === "Request failed") {
        throw new Error(
          "Registration service unavailable. Please try again later.",
        );
      }
      throw error;
    }
  },

  verify: async (payload: { email: string; code: string }) => {
    try {
      return await apiClient.auth.verifyOtp(payload);
    } catch (error: any) {
      throw error;
    }
  },

  resendCode: async (payload: { email: string }) => {
    return await apiClient.auth.resendOtp(payload);
  },

  forgotPassword: async (payload: { email: string }) => {
    return await apiClient.auth.forgotPassword(payload);
  },

  resetPassword: async (payload: any) => {
    return await apiClient.auth.resetPassword(payload);
  },

  logout: async () => {
    return await apiClient.auth.logout();
  },
};
