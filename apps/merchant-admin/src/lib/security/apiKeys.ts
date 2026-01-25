import { prisma } from "../../lib/prisma";
import { randomBytes, createHash } from "crypto";

export class ApiKeyService {
    private static KEY_PREFIX = "vayva_live_";

    static hashKey(key: string): string {
        return createHash("sha256").update(key).digest("hex");
    }

    static async createKey(storeId: string, name: string, scopes: string[], _userId: string) {
        const rawKey = `${this.KEY_PREFIX}${randomBytes(16).toString("hex")}`;
        const keyHash = this.hashKey(rawKey);

        const apiKey = await prisma.apiKey.create({
            data: {
                storeId,
                name,
                scopes,
                keyHash,
                status: "ACTIVE",
            }
        });

        return {
            id: apiKey.id,
            key: rawKey,
        };
    }

    static async verifyApiKey(rawKey: string, ip?: string) {
        const keyHash = this.hashKey(rawKey);
        const apiKey = await prisma.apiKey.findUnique({
            where: { keyHash },
        });

        if (!apiKey) {
            throw new Error("Invalid API Key");
        }

        if (apiKey.status !== "ACTIVE") {
            throw new Error("API Key is disabled");
        }

        if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
            throw new Error("API Key has expired");
        }

        if (apiKey.ipAllowlist && Array.isArray(apiKey.ipAllowlist) && apiKey.ipAllowlist.length > 0) {
            if (!ip || !apiKey.ipAllowlist.includes(ip)) {
                throw new Error(`IP ${ip || "unknown"} is not allowed`);
            }
        }

        return apiKey;
    }
}
