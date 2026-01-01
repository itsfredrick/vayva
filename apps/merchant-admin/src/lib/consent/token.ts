import { createHmac } from "crypto";

const SECRET =
  process.env.PREFERENCES_TOKEN_SECRET || "dev_secret_do_not_use_in_prod";

interface TokenPayload {
  merchantId: string;
  phoneE164: string;
  exp: number; // Unix timestamp
}

export function createPreferencesToken(
  merchantId: string,
  phoneE164: string,
  ttlDays = 30,
): string {
  const exp = Math.floor(Date.now() / 1000) + ttlDays * 24 * 60 * 60;
  const payload: TokenPayload = { merchantId, phoneE164, exp };

  // Create base64url payload
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");

  // Sign
  const hmac = createHmac("sha256", SECRET);
  hmac.update(payloadStr);
  const signature = hmac.digest("base64url");

  return `${payloadStr}.${signature}`;
}

export function verifyPreferencesToken(token: string): TokenPayload | null {
  try {
    const [payloadStr, signature] = token.split(".");
    if (!payloadStr || !signature) return null;

    // Verify signature
    const hmac = createHmac("sha256", SECRET);
    hmac.update(payloadStr);
    const expectedSignature = hmac.digest("base64url");

    if (signature !== expectedSignature) return null;

    // Decode
    const payload = JSON.parse(
      Buffer.from(payloadStr, "base64url").toString(),
    ) as TokenPayload;

    // Verify expiry
    if (Date.now() / 1000 > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch (e) {
    return null;
  }
}
