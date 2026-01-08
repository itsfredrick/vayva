import { NextRequest } from "next/server";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

export class VisitorService {
  static COOKIE_NAME = "vayva_vid";

  /**
   * gets or generates a visitor ID.
   * returned ID is safe to store (hashed) if privacy strictly required,
   * but here we manage the Cookie ID vs Storage ID.
   */
  static getVisitorId(req: NextRequest): { id: string; isNew: boolean } {
    const existing = req.cookies.get(this.COOKIE_NAME)?.value;
    if (existing) return { id: existing, isNew: false };

    return { id: uuidv4(), isNew: true };
  }

  /**
   * Hashes the raw UUID for storage to ensure DB dumps don't allow
   * correlating visits easily without the cookie key (if we salt it).
   * For V1, we store the UUID to allow basic retention analysis.
   * Use this method if we decide to salt/hash later.
   */
  static hashForStorage(visitorId: string): string {
    return crypto
      .createHash("sha256")
      .update(visitorId + process.env.ANALYTICS_SALT)
      .digest("hex")
      .substring(0, 16);
  }
}
