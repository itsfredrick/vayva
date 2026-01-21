import { apiClient } from "@vayva/api-client";
export const AuthService = {
    login: async (credentials) => {
        try {
            return await apiClient.auth.login(credentials);
        }
        catch (error) {
            // NO TEST FALLBACK - Fail cleanly if backend unavailable
            if (error.message === "Request failed") {
                throw new Error("Authentication service unavailable. Please try again later.");
            }
            throw error;
        }
    },
    getProfile: async () => {
        return await apiClient.auth.me();
    },
    register: async (payload) => {
        try {
            return await apiClient.auth.register(payload);
        }
        catch (error) {
            if (error.message === "Request failed") {
                throw new Error("Registration service unavailable. Please try again later.");
            }
            throw error;
        }
    },
    verify: async (payload) => {
        try {
            return await apiClient.auth.verifyOtp(payload);
        }
        catch (error) {
            throw error;
        }
    },
    resendCode: async (payload) => {
        return await apiClient.auth.resendOtp(payload);
    },
    forgotPassword: async (payload) => {
        return await apiClient.auth.forgotPassword(payload);
    },
    resetPassword: async (payload) => {
        return await apiClient.auth.resetPassword(payload);
    },
    logout: async () => {
        return await apiClient.auth.logout();
    },
};
