import speakeasy from "speakeasy";
import QRCode from "qrcode";
export const MFA_APP_NAME = "Vayva Platform";
/**
 * Generate a new MFA secret for a user.
 * Returns the secret (store in DB) and a data URL for the QR code (show to user).
 */
export async function generateMfaSecret(userEmail: unknown) {
    const secret = speakeasy.generateSecret({
        length: 20,
        name: `${MFA_APP_NAME} (${userEmail})`,
        issuer: MFA_APP_NAME,
    });
    const otpauth_url = secret.otpauth_url;
    if (!otpauth_url) {
        throw new Error("Failed to generate OTP Auth URL");
    }
    const qrCodeUrl = await QRCode.toDataURL(otpauth_url);
    return {
        secret: secret.base32,
        qrCodeUrl,
        otpauth_url
    };
}
/**
 * Verify a token against a stored secret.
 * Returns true if valid.
 */
export function verifyMfaToken(secret: unknown, token: unknown) {
    return speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
        window: 1, // Allow +/- 30 seconds drift
    });
}
