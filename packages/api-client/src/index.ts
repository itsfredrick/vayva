import { AuthMeResponse } from '@vayva/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

class ApiClient {
    private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${path}`;

        // Ensure credentials are sent for httpOnly cookies
        options.credentials = 'include';
        options.headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(error.error || 'Request failed');
        }

        return response.json();
    }

    // Auth
    auth = {
        login: (data: any) => this.request<any>('/auth/merchant/login', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        register: (data: any) => this.request<any>('/auth/merchant/register', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        verifyOtp: (data: any) => this.request<any>('/auth/merchant/verify-otp', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        resendOtp: (data: any) => this.request<any>('/auth/merchant/resend-otp', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        forgotPassword: (data: any) => this.request<any>('/auth/merchant/forgot-password', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        resetPassword: (data: any) => this.request<any>('/auth/merchant/reset-password', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        logout: () => this.request<any>('/auth/merchant/logout', { method: 'POST' }),
        me: () => this.request<AuthMeResponse>('/auth/merchant/me'),
    };

    // Onboarding
    onboarding = {
        getState: () => this.request<any>('/onboarding/state'),
        updateState: (data: any) => this.request<any>('/onboarding/state', {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),
    };

    // Staff
    staff = {
        list: () => this.request<any[]>('/staff'),
        getInvites: () => this.request<any[]>('/staff/invites'),
        invite: (data: any) => this.request<any>('/staff/invite', {

            method: 'POST',
            body: JSON.stringify(data)
        }),
        acceptInvite: (data: any) => this.request<any>('/staff/invites/accept', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        remove: (id: string) => this.request<any>(`/staff/${id}`, { method: 'DELETE' }),
    };
}

export const apiClient = new ApiClient();
export type * from './generated/schema';
