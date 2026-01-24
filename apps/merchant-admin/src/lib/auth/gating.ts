import jwt, { JwtPayload } from "jsonwebtoken";
import { OnboardingStatus } from "@vayva/db";

export interface FeatureAccessResponse {
    allowed: boolean;
    reason?: string;
    message?: string;
}

export function verifyStoreAccess(token: string): boolean {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as string | JwtPayload;

        if (typeof decoded === "string") return false;

        const payload = decoded as JwtPayload & { storeId?: string; pinVersion?: string };
        if (!payload.storeId || payload.pinVersion !== "1") {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

export async function checkFeatureAccess(storeId: string, feature: string): Promise<FeatureAccessResponse> {
    // Dynamic import to avoid circular dep if needed, or straight import
    const { checkFeatureAccess: check } = await import("@/lib/billing/access");
    return check(storeId, feature) as Promise<FeatureAccessResponse>;
}

export async function createPinSession(_storeId: string): Promise<string> {
    return "temp_token";
}

export const Gating = {
    verifyStoreAccess,
    checkFeatureAccess,
    createPinSession
};
