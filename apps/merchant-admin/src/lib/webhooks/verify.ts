import { createHmac } from "crypto";
export function verifyPaystackSignature(payload: unknown, signature: unknown, secret: unknown) {
    const hash = createHmac("sha512", secret)
        .update(payload)
        .digest("hex");
    return hash === signature;
}
export function verifyWhatsappSignature(rawBody: unknown, signatureHeader: unknown, appSecret: unknown) {
    // Header often X-Hub-Signature-256: sha256=...
    if (!signatureHeader)
        return false;
    const signature = signatureHeader.replace("sha256=", "");
    const hash = createHmac("sha256", appSecret).update(rawBody).digest("hex");
    return hash === signature;
}
