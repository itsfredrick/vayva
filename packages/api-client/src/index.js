// Use relative path to work with Next.js API routes in all environments
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
class ApiClient {
    constructor() {
        // Auth
        this.auth = {
            login: (data) => this.request("/auth/merchant/login", {
                method: "POST",
                body: JSON.stringify(data),
            }),
            register: (data) => this.request("/auth/merchant/register", {
                method: "POST",
                body: JSON.stringify(data),
            }),
            verifyOtp: (data) => this.request("/auth/merchant/verify-otp", {
                method: "POST",
                body: JSON.stringify(data),
            }),
            resendOtp: (data) => this.request("/auth/merchant/resend-otp", {
                method: "POST",
                body: JSON.stringify(data),
            }),
            forgotPassword: (data) => this.request("/auth/merchant/forgot-password", {
                method: "POST",
                body: JSON.stringify(data),
            }),
            resetPassword: (data) => this.request("/auth/merchant/reset-password", {
                method: "POST",
                body: JSON.stringify(data),
            }),
            logout: () => this.request("/auth/merchant/logout", { method: "POST" }),
            me: () => this.request("/auth/merchant/me"),
        };
        // Onboarding
        this.onboarding = {
            getState: () => this.request("/onboarding/state"),
            updateState: (data) => this.request("/onboarding/state", {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        };
        // Staff
        this.staff = {
            list: () => this.request("/staff"),
            getInvites: () => this.request("/staff/invites"),
            invite: (data) => this.request("/staff/invite", {
                method: "POST",
                body: JSON.stringify(data),
            }),
            acceptInvite: (data) => this.request("/staff/invites/accept", {
                method: "POST",
                body: JSON.stringify(data),
            }),
            remove: (id) => this.request(`/staff/${id}`, { method: "DELETE" }),
        };
    }
    async request(path, options = {}) {
        const url = `${API_BASE_URL}${path}`;
        // Ensure credentials are sent for httpOnly cookies
        options.credentials = "include";
        options.headers = {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            const error = await response
                .json()
                .catch(() => ({ error: "Unknown error" }));
            throw new Error(error.error || "Request failed");
        }
        return response.json();
    }
}
export const apiClient = new ApiClient();
