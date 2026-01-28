import { prisma } from "@vayva/db";
import { Resend } from "resend";
import * as crypto from "crypto";
import { getEnv } from "../env";

const env = getEnv();
const resendApiKey = env.RESEND_API_KEY;
const resendFromEmail = env.AUTH_OTP_FROM_EMAIL || env.RESEND_FROM_EMAIL || "no-reply@vayva.com";

export const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const dispatchOtp = async (identifier: string, code: string, type: string) => {
  if (!resendApiKey) {
    console.warn(
      "[OTP] RESEND_API_KEY not configured; skipping email send",
    );
    return;
  }

  const resend = new Resend(resendApiKey);
  try {
    await resend.emails.send({
      from: resendFromEmail,
      to: identifier,
      subject: "Your Vayva verification code",
      text: `Your ${type.toLowerCase()} code is ${code}. It expires in 10 minutes.`,
    });
  } catch (err) {
    console.error("[OTP] Failed to dispatch via Resend", err);
  }
};

export const storeOtp = async (identifier: string, type: string) => {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await prisma.otpCode.create({
    data: {
      identifier,
      code,
      type,
      expiresAt,
    },
  });

  // Send via email provider (fall back to logs if not configured)
  await dispatchOtp(identifier, code, type);

  return code;
};

export const verifyOtp = async (
  identifier: string,
  code: string,
  type: string,
) => {
  const record = await prisma.otpCode.findFirst({
    where: {
      identifier,
      code,
      type,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) return false;

  await prisma.otpCode.update({
    where: { id: record.id },
    data: { isUsed: true },
  });

  return true;
};
