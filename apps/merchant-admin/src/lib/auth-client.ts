import {
  LoginRequest,
  SignupRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@vayva/schemas";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Ensure no localhost in production
if (typeof window !== "undefined" && window.location.hostname !== "localhost" && API_URL.includes("localhost")) {
  console.warn("AuthClient initialized with localhost API in production environment.");
}


export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

class AuthClient {
  private async request<T>(
    endpoint: string,
    method: string,
    body: any,
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("vayva_token")
        : null;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data.error || { message: "An unknown error occurred" };
      }

      return data as T;
    } catch (error) {
      throw error;
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(
      "/auth/login",
      "POST",
      data,
    );
    if (response.token) {
      this.setSession(response.token, response.user);
    }
    return response;
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(
      "/auth/signup",
      "POST",
      data,
    );
    if (response.token) {
      this.setSession(response.token, response.user);
    }
    return response;
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/forgot-password", "POST", data);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/reset-password", "POST", data);
  }

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vayva_token");
      localStorage.removeItem("vayva_user");
      window.location.href = "/signin";
    }
  }

  private setSession(token: string, user: any) {
    if (typeof window !== "undefined") {
      localStorage.setItem("vayva_token", token);
      localStorage.setItem("vayva_user", JSON.stringify(user));
    }
  }

  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("vayva_token");
    }
    return false;
  }
}

export const authClient = new AuthClient();
