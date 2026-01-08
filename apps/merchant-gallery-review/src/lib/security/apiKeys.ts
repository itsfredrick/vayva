import crypto from "crypto";

export class ApiKeyService {
  private static PREFIX = "vayva_live_";

  static generateKey() {
    // 32 bytes of entropy
    const random = crypto
      .randomBytes(24)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    const key = `${this.PREFIX}${random}`;
    return key;
  }

  static hashKey(key: string): string {
    return crypto.createHash("sha256").update(key).digest("hex");
  }

  static getPrefix(key: string): string {
    return key.substring(0, 15) + "...";
  }

  static match(rawKey: string, storedHash: string): boolean {
    const hash = this.hashKey(rawKey);
    // Constant time comparison
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
  }

  static async createKey(
    storeId: string,
    name: string,
    scopes: string[],
    userId: string,
  ) {
    const { prisma } = await import("@vayva/db");
    const rawKey = this.generateKey();
    const keyHash = this.hashKey(rawKey);
    const prefix = this.getPrefix(rawKey);

    const apiKey = await prisma.apiKey.create({
      data: {
        storeId,
        name,
        keyHash,
        scopes,
        status: "ACTIVE",
      },
    });

    return { ...apiKey, key: rawKey };
  }

  static async revokeKey(keyId: string, storeId: string) {
    const { prisma } = await import("@vayva/db");
    // Ensure the key belongs to the store
    await prisma.apiKey.updateMany({
      where: { id: keyId, storeId },
      data: {
        status: "REVOKED",
        revokedAt: new Date(),
      },
    });
  }
}
