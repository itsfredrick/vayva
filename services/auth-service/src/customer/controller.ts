import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "@vayva/db";
import { storeOtp, verifyOtp } from "../utils/otp";

const startSchema = z
  .object({
    phone: z.string().optional(),
    email: z.string().email().optional(),
  })
  .refine((data) => data.phone || data.email, {
    message: "Either phone or email must be provided",
  });

const verifySchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  code: z.string().length(6),
});

export const startAuthHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { phone, email } = startSchema.parse(req.body);
  const identifier = phone || email!;

  await storeOtp(identifier, "LOGIN"); // Simplified type

  return reply.send({ message: "OTP sent", identifier });
};

export const verifyAuthHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { phone, email, code } = verifySchema.parse(req.body);
  const identifier = phone || email!;

  const isValid = await verifyOtp(identifier, code, "LOGIN");
  if (!isValid) {
    return reply.status(401).send({ error: "Invalid or expired OTP" });
  }

  // Find or Create Customer Account
  let account = await prisma.customerAccount.findFirst({
    where: {
      OR: [{ email: email || undefined }, { phone: phone || undefined }],
    },
  });

  if (!account) {
    account = await prisma.customerAccount.create({
      data: {
        email,
        phone,
        isVerified: true,
      },
    });
  } else if (!account.isVerified) {
    account = await prisma.customerAccount.update({
      where: { id: account.id },
      data: { isVerified: true },
    });
  }

  // Create Customer Session
  const token = await reply.jwtSign({
    sub: account.id,
    aud: "customer",
    email: account.email,
    phone: account.phone,
  });

  await prisma.customerSession.create({
    data: {
      customerId: account.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days long session for customers
    },
  });

  return reply.send({
    token,
    account: { id: account.id, email: account.email },
  });
};
