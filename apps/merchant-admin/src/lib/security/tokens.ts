import crypto from "crypto";

export class SecurityUtils {
  /**
   * Generates a cryptographically strong random token.
   */
  static generateToken(byteLength: number = 32): string {
    return crypto.randomBytes(byteLength).toString("hex");
  }

  /**
   * Hashes a token using SHA-256 for secure storage.
   */
  static hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /**
   * Compares two strings using constant-time algorithm to prevent timing attacks.
   */
  static constantTimeCompare(a: string, b: string): boolean {
    return crypto.timingSafeEqual(
      Buffer.from(a, "utf8"),
      Buffer.from(b, "utf8"),
    );
  }
}
