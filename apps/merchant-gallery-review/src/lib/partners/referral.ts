import crypto from "crypto";

const PARTNER_SECRET =
  process.env.PARTNER_SECRET || "dev-partner-secret-DoNotUseInProd";

export interface ReferralPayload {
  partnerId: string;
  code: string;
  exp: number;
}

export function signReferralToken(
  partnerId: string,
  code: string,
  expiresInHours = 24 * 30,
): string {
  const exp = Date.now() + expiresInHours * 60 * 60 * 1000;
  const payload: ReferralPayload = { partnerId, code, exp };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64");

  const signature = crypto
    .createHmac("sha256", PARTNER_SECRET)
    .update(data)
    .digest("hex");

  return `${data}.${signature}`;
}

export function verifyReferralToken(token: string): ReferralPayload | null {
  if (!token) return null;

  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const expectedSignature = crypto
    .createHmac("sha256", PARTNER_SECRET)
    .update(data)
    .digest("hex");

  if (signature !== expectedSignature) return null; // Tampered

  try {
    const payload: ReferralPayload = JSON.parse(
      Buffer.from(data, "base64").toString(),
    );
    if (Date.now() > payload.exp) return null; // Expired
    return payload;
  } catch {
    return null;
  }
}
