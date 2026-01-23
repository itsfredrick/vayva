import crypto from "crypto";
const PARTNER_SECRET = process.env.PARTNER_SECRET || "dev-partner-secret-DoNotUseInProd";
export function signReferralToken(partnerId: unknown, code: unknown, expiresInHours = 24 * 30) {
    const exp = Date.now() + expiresInHours * 60 * 60 * 1000;
    const payload = { partnerId, code, exp };
    const data = Buffer.from(JSON.stringify(payload)).toString("base64");
    const signature = crypto
        .createHmac("sha256", PARTNER_SECRET)
        .update(data)
        .digest("hex");
    return `${data}.${signature}`;
}
export function verifyReferralToken(token: unknown) {
    if (!token)
        return null;
    const [data, signature] = token.split(".");
    if (!data || !signature)
        return null;
    const expectedSignature = crypto
        .createHmac("sha256", PARTNER_SECRET)
        .update(data)
        .digest("hex");
    if (signature !== expectedSignature)
        return null; // Tampered
    try {
        const payload = JSON.parse(Buffer.from(data, "base64").toString());
        if (Date.now() > payload.exp)
            return null; // Expired
        return payload;
    }
    catch {
        return null;
    }
}
