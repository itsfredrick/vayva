import { apiClient } from '@vayva/api-client';

export class OpsAuthService {
    static async login(credentials: any) {
        try {
            const response = await fetch('http://localhost:4000/v1/auth/ops/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            return await response.json();
        } catch (error) {
            console.error('Ops login error', error);
            // Fallback for dev
            return { mfaRequired: true, tempToken: 'mock_temp_token' };
        }
    }

    static async verifyMfa(data: { tempToken: string; code: string }) {
        const response = await fetch('http://localhost:4000/v1/auth/ops/verify-mfa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    static async getMe() {
        const response = await fetch('http://localhost:4000/v1/auth/ops/me', {
            headers: { 'Credentials': 'include' } as any
        });
        return await response.json();
    }
}
