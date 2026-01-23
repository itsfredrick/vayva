import { createHmac } from "crypto";
const SECRET = process.env.PREFERENCES_TOKEN_SECRET || "dev_secret_do_not_use_in_prod";
export function createPreferencesToken(merchantId: any, phoneE164: any, ttlDays = 30) {
    const exp = Math.floor(Date.now() / 1000) + ttlDays * 24 * 60 * 60;
    const payload = { merchantId, phoneE164, exp };
    // Create base64url payload
    const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
    // Sign
    const hmac = createHmac("sha256", SECRET);
    hmac.update(payloadStr);
    const signature = hmac.digest("base64url");
    return `${payloadStr}.${signature}`;
}
export function verifyPreferencesToken(token: any) {
    try {
        const [payloadStr, signature] = token.split(".");
        if (!payloadStr || !signature)
            return null;
        // Verify signature
        const hmac = createHmac("sha256", SECRET);
        hmac.update(payloadStr);
        const expectedSignature = hmac.digest("base64url");
        if (signature !== expectedSignature)
            return null;
        // Decode
        const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString());
        // Verify expiry
        if (Date.now() / 1000 > payload.exp) {
            return null; // Expired
        }
        return payload;
    }
    catch (e) {
        return null;
    }
}
