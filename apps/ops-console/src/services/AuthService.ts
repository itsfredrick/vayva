import { apiClient } from "@vayva/api-client";

export class OpsAuthService {
  static async login(credentials: any) {
    const apiBase = process.env.API_URL || "http://localhost:4000";
    try {
      const response = await fetch(`${apiBase}/v1/auth/ops/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      return await response.json();
    } catch (error) {
      console.error("Ops login error", error);
      // Fallback for dev
      return { mfaRequired: true, tempToken: "mock_temp_token" };
    }
  }

  static async verifyMfa(data: { tempToken: string; code: string }) {
    const apiBase = process.env.API_URL || "http://localhost:4000";
    const response = await fetch(
      `${apiBase}/v1/auth/ops/verify-mfa`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    return await response.json();
  }


  static async getMe() {
    const apiBase = process.env.API_URL || "http://localhost:4000";
    const response = await fetch(`${apiBase}/v1/auth/ops/me`, {
      headers: { Credentials: "include" } as any,
    });
    return await response.json();
  }
}
