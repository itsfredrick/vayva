import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@vayva/db";

export const listApprovalsHandler = async (
  req: FastifyRequest<{ Querystring: { storeId: string; status?: string } }>,
  reply: FastifyReply,
) => {
  const { storeId, status } = req.query;
  if (!storeId) {
    req.log.error("storeId required for listApprovalsHandler");
    return reply.status(400).send({ error: "storeId required" });
  }

  const approvals = await prisma.approval.findMany({
    where: {
      storeId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: (status as any) || undefined,
    },
    orderBy: { createdAt: "desc" },
  });

  return reply.send(approvals);
};

export const approveHandler = async (
  req: FastifyRequest<{ Params: { id: string }; Body: { approverId: string } }>,
  reply: FastifyReply,
) => {
  const { id } = req.params;
  const { approverId } = req.body; // In real app, from Token

  const approval = await prisma.approval.update({
    where: { id },
    data: {
      status: "APPROVED",
      actionBy: approverId || "system",
      // approvedAt: new Date() // Schema doesn't have approvedAt, checks updatedAT
    },
  });

  // Execute Hook (Placeholder)
  // e.g. Trigger downstream notification flow via shared service


  return reply.send(approval);
};
