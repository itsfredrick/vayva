import { apiClient } from "@vayva/api-client";
import {
  ApiResponse,
  LoginRequest,
  AuthResponseData,
  RegisterRequest
} from "@vayva/shared";

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || "Request failed");
  }
  return response.data;
};

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<AuthResponseData> => {
    const response = await apiClient.auth.login(credentials);
    return unwrap(response);
  },

  getProfile: async () => {
    const response = await apiClient.auth.me();
    return unwrap(response);
  },

  register: async (payload: RegisterRequest) => {
    const response = await apiClient.auth.register(payload);
    return unwrap(response);
  },

  verify: async (payload: { email: string; otp: string }) => {
    const response = await apiClient.auth.verifyOtp(payload);
    return unwrap(response);
  },

  resendCode: async (payload: { email: string }) => {
    const response = await apiClient.auth.resendOtp(payload);
    return unwrap(response);
  },

  forgotPassword: async (payload: { email: string }) => {
    const response = await apiClient.auth.forgotPassword(payload);
    return unwrap(response);
  },

  resetPassword: async (payload: { token: string; password?: string }) => {
    const response = await apiClient.auth.resetPassword(payload);
    return unwrap(response);
  },

  logout: async () => {
    const response = await apiClient.auth.logout();
    return unwrap(response);
  },
};
