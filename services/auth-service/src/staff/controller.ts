import { FastifyRequest, FastifyReply } from "fastify";
import { prisma, AppRole } from "@vayva/db";
import { z } from "zod";
import * as crypto from "crypto";
import bcrypt from "bcryptjs";
import { UserRole } from "@vayva/shared";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(UserRole).default(UserRole.STAFF),
});

const acceptInviteSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
});

export const inviteStaffHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = req.user as { sub: string };
  const { email, role } = inviteSchema.parse(req.body) as {
    email: string;
    role: UserRole;
  };

  const membership = await prisma.membership.findFirst({
    where: { userId: user.sub },
    include: { store: true },
  });

  if (
    !membership ||
    (membership.role_enum !== UserRole.OWNER && membership.role_enum !== UserRole.ADMIN)
  ) {
    return reply
      .status(403)
      .send({
        error: "FORBIDDEN",
        message: "Only Owner or Admin can invite staff",
      });
  }

  const { store } = membership;

  // Plan Limits
  const staffCount = await prisma.membership.count({
    where: { storeId: store.id },
  });
  if (store.plan === "STARTER") {
    return reply
      .status(403)
      .send({ error: "PLAN_LIMIT", message: "Upgrade to PRO to invite staff" });
  }
  if (store.plan === "PRO" && staffCount >= 6) {
    // 1 owner + 5 staff
    return reply
      .status(403)
      .send({
        error: "PLAN_LIMIT",
        message: "Staff limit reached for PRO plan",
      });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const invite = await prisma.staffInvite.create({
    data: {
      storeId: store.id,
      email,
      role,
      token,
      createdBy: user.sub || "admin",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // eslint-disable-next-line no-console
  console.log(
    `[STAFF] Invite sent to ${email} for store ${store.name}. Token: ${token}`,
  );

  return reply
    .status(201)
    .send({ message: "Invite sent", inviteId: invite.id });
};

export const getInvitesHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = req.user as { sub: string };
  const membership = await prisma.membership.findFirst({
    where: { userId: user.sub },
  });

  if (!membership) return reply.status(404).send({ error: "Store not found" });

  const invites = await prisma.staffInvite.findMany({
    where: { storeId: membership.storeId, acceptedAt: null },
  });

  return reply.send(invites);
};

export const acceptInviteHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { token, password, firstName, lastName } = acceptInviteSchema.parse(
    req.body,
  );

  const invite = await prisma.staffInvite.findUnique({
    where: { token, acceptedAt: null },
    include: { store: true },
  });

  if (!invite || invite.expiresAt < new Date()) {
    return reply.status(400).send({ error: "Invalid or expired invite token" });
  }

  // Check if user already exists
  let user = await prisma.user.findUnique({ where: { email: invite.email } });

  if (!user) {
    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        email: invite.email,
        password: hashedPassword,
        firstName,
        lastName,
        isEmailVerified: true,
      },
    });
  }

  // Create membership
  await prisma.membership.create({
    data: {
      userId: user.id,
      storeId: invite.storeId,
      role_enum: invite.role as AppRole,
    },
  });

  // Mark invite as accepted
  await prisma.staffInvite.update({
    where: { id: invite.id },
    data: { acceptedAt: new Date() },
  });

  return reply.send({ message: "Invite accepted. You can now login." });
};

export const getStaffHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = req.user as { sub: string };
  const membership = await prisma.membership.findFirst({
    where: { userId: user.sub },
  });

  if (!membership) return reply.status(404).send({ error: "Store not found" });

  const staff = await prisma.membership.findMany({
    where: { storeId: membership.storeId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return reply.send(staff);
};

export const removeStaffHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = req.user as { sub: string };
  const { id } = req.params as { id: string };

  const actingMember = await prisma.membership.findFirst({
    where: { userId: user.sub },
  });

  if (!actingMember || actingMember.role_enum !== UserRole.OWNER) {
    return reply
      .status(403)
      .send({ error: "FORBIDDEN", message: "Only Owner can remove staff" });
  }

  await prisma.membership.delete({ where: { id } });

  return reply.send({ message: "Staff removed" });
};
