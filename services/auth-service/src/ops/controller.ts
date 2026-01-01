import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "@vayva/db";
import { authenticator } from "otplib";
import { hashPassword, verifyPassword } from "../utils/hash";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const mfaVerifySchema = z.object({
  preAuthToken: z.string(),
  code: z.string(),
});

export const loginHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { email, password } = loginSchema.parse(req.body);

  const opsUser = await prisma.opsUser.findUnique({ where: { email } });

  if (!opsUser || !(await verifyPassword(password, opsUser.password))) {
    return reply.status(401).send({ error: "Invalid credentials" });
  }

  // Issue Pre-Auth Token (Restricted audience)
  const preAuthToken = await reply.jwtSign(
    {
      sub: opsUser.id,
      aud: "ops-pre-mfa",
      email: opsUser.email,
    },
    { expiresIn: "5m" },
  );

  return reply.send({ preAuthToken, message: "MFA required" });
};

export const verifyMfaHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { preAuthToken, code } = mfaVerifySchema.parse(req.body);

  // Decode/Verify PreAuth Token
  const decoded = req.server.jwt.verify<any>(preAuthToken);
  if (decoded.aud !== "ops-pre-mfa") {
    return reply.status(401).send({ error: "Invalid token audience" });
  }

  const opsUser = await prisma.opsUser.findUnique({
    where: { id: decoded.sub },
  });
  if (!opsUser || !opsUser.isMfaEnabled || !opsUser.mfaSecret) {
    return reply.status(400).send({ error: "MFA not enabled for user" });
  }

  // Verify TOTP
  const isValid = authenticator.check(code, opsUser.mfaSecret);
  if (!isValid) {
    return reply.status(401).send({ error: "Invalid MFA code" });
  }

  // Issue Real Ops Token
  const token = await reply.jwtSign({
    sub: opsUser.id,
    aud: "ops",
    role: opsUser.role,
  });

  // Create Ops Session
  await prisma.opsSession.create({
    data: {
      opsUserId: opsUser.id,
      token,
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
    },
  });

  return reply.send({ token });
};

// Bootstrap tools
export const registerOpsHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const body = z
    .object({
      email: z.string().email(),
      password: z.string(),
      name: z.string(),
      role: z.enum(["OPS_ADMIN", "OPS_AGENT"]),
    })
    .parse(req.body);

  const existing = await prisma.opsUser.findUnique({
    where: { email: body.email },
  });
  if (existing) return reply.status(409).send({ error: "Exists" });

  const opsUser = await prisma.opsUser.create({
    data: {
      email: body.email,
      password: await hashPassword(body.password),
      name: body.name,
      role: body.role,
    },
  });

  return reply.send({ id: opsUser.id });
};

export const setupMfaHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  // In real life, authenticated by session. Here bootstrapping.
  const { email } = z.object({ email: z.string().email() }).parse(req.body);

  const secret = authenticator.generateSecret();

  await prisma.opsUser.update({
    where: { email },
    data: { mfaSecret: secret, isMfaEnabled: true },
  });

  return reply.send({
    secret,
    otpauth: authenticator.keyuri(email, "Vayva Ops", secret),
  });
};

export const getMeHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const decoded = req.user as any;
  const opsUser = await prisma.opsUser.findUnique({
    where: { id: decoded.sub },
  });

  if (!opsUser) return reply.status(404).send({ error: "Ops user not found" });

  return reply.send({
    id: opsUser.id,
    email: opsUser.email,
    name: opsUser.name,
    role: opsUser.role,
    createdAt: opsUser.createdAt.toISOString(),
  });
};

export const logoutHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    await prisma.opsSession.deleteMany({ where: { token } });
  }
  return reply.send({ message: "Logged out successfully" });
};
