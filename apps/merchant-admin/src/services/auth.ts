import { apiClient } from "@vayva/api-client";
import {
    LoginRequest,
    RegisterRequest,
    AuthResponseData,
    AuthMeResponse,
    ApiResponse
} from "@vayva/shared";

export const AuthService = {
    login: async (credentials: LoginRequest): Promise<AuthResponseData> => {
        try {
            const response = await apiClient.auth.login(credentials);
            if (!response.success && response.error) {
                throw new Error(response.error.message);
            }
            return response.data!;
        }
        catch (error: any) {
            // NO TEST FALLBACK - Fail cleanly if backend unavailable
            if (error.message === "Request failed") {
                throw new Error("Authentication service unavailable. Please try again later.");
            }
            throw error;
        }
    },
    getProfile: async (): Promise<AuthMeResponse> => {
        const response = await apiClient.auth.me();
        if (!response.success && response.error) {
            throw new Error(response.error.message);
        }
        return response.data!;
    },
    register: async (payload: RegisterRequest): Promise<AuthResponseData> => {
        try {
            const response = await apiClient.auth.register(payload);
            if (!response.success && response.error) {
                throw new Error(response.error.message);
            }
            return response.data!;
        }
        catch (error: any) {
            if (error.message === "Request failed") {
                throw new Error("Registration service unavailable. Please try again later.");
            }
            throw error;
        }
    },
    verify: async (payload: { email: string; otp: string }): Promise<boolean> => {
        try {
            const response = await apiClient.auth.verifyOtp(payload);
            return response.success;
        }
        catch (error: any) {
            throw error;
        }
    },
    resendCode: async (payload: { email: string }): Promise<boolean> => {
        const response = await apiClient.auth.resendOtp(payload);
        return response.success;
    },
    forgotPassword: async (payload: { email: string }): Promise<boolean> => {
        const response = await apiClient.auth.forgotPassword(payload);
        return response.success;
    },
    resetPassword: async (payload: { token: string; password?: string }): Promise<boolean> => {
        const response = await apiClient.auth.resetPassword(payload);
        return response.success;
    },
    logout: async (): Promise<boolean> => {
        const response = await apiClient.auth.logout();
        return response.success;
    },
};
