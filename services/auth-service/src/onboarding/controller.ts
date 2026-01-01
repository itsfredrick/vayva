import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@vayva/db";
import { z } from "zod";

const updateOnboardingSchema = z.object({
  step: z.string(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETE"]).optional(),
});

export const getOnboardingStateHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = req.user as any;

  const membership = await prisma.membership.findFirst({
    where: { userId: user.sub },
    include: { store: true },
  });

  if (!membership || !membership.store) {
    return reply.status(404).send({ error: "Store not found" });
  }

  const { store } = membership;

  return reply.send({
    status: store.onboardingStatus,
    lastStep: store.onboardingLastStep,
    updatedAt: store.onboardingUpdatedAt.toISOString(),
  });
};

export const updateOnboardingStateHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = req.user as any;
  const { step, status } = updateOnboardingSchema.parse(req.body);

  const membership = await prisma.membership.findFirst({
    where: { userId: user.sub },
    include: { store: true },
  });

  if (!membership || !membership.store) {
    return reply.status(404).send({ error: "Store not found" });
  }

  const updatedStore = await prisma.store.update({
    where: { id: membership.storeId },
    data: {
      onboardingLastStep: step,
      onboardingStatus: status || "IN_PROGRESS",
      onboardingUpdatedAt: new Date(),
    },
  });

  return reply.send({
    status: updatedStore.onboardingStatus,
    lastStep: updatedStore.onboardingLastStep,
    updatedAt: updatedStore.onboardingUpdatedAt.toISOString(),
  });
};
