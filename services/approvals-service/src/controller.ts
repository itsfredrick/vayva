import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@vayva/db";

export const listApprovalsHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { storeId, status } = req.query as { storeId: string; status?: string };
  if (!storeId) {
    (req.log as any).error("storeId required for listApprovalsHandler");
    return reply.status(400).send({ error: "storeId required" });
  }

  const approvals = await prisma.approval.findMany({
    where: {
      storeId,
      status: (status as any) || undefined,
    },
    orderBy: { createdAt: "desc" },
  });

  return reply.send(approvals);
};

export const approveHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = req.params as { id: string };
  const { approverId } = req.body as { approverId: string }; // In real app, from Token

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
  console.log(`[Approval] ${id} approved. Triggering downstream actions...`);


  return reply.send(approval);
};
