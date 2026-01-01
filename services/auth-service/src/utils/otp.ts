import { prisma } from "@vayva/db";
import * as crypto from "crypto";

export const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
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

  // TODO: Send via SMS/Email Provider
  console.log(`[OTP] Generated for ${identifier} (${type}): ${code}`);

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
