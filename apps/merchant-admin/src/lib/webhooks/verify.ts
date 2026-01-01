import { createHmac } from "crypto";

export function verifyPaystackSignature(
  payload: any,
  signature: string,
  secret: string,
): boolean {
  const hash = createHmac("sha512", secret)
    .update(JSON.stringify(payload))
    .digest("hex");
  return hash === signature;
}

export function verifyWhatsappSignature(
  rawBody: string,
  signatureHeader: string,
  appSecret: string,
): boolean {
  // Header often X-Hub-Signature-256: sha256=...
  if (!signatureHeader) return false;

  const signature = signatureHeader.replace("sha256=", "");
  const hash = createHmac("sha256", appSecret).update(rawBody).digest("hex");

  return hash === signature;
}
