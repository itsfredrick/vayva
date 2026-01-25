import { FastifyRequest, FastifyReply } from "fastify";
import { disputeService } from "../services/dispute-service";
import { DisputeProvider, DisputeEvidenceType } from "@vayva/db";

interface CreateDisputeBody {
  merchantId: string;
  provider: DisputeProvider;
  providerDisputeId: string;
  amount: number;
  currency: string;
  reasonCode?: string;
  paymentId?: string;
  orderId?: string;
  evidenceDueAt?: string;
}

export const createDisputeHandler = async (
  request: FastifyRequest<{
    Body: CreateDisputeBody;
  }>,
  reply: FastifyReply,
) => {
  try {
    const dispute = await disputeService.createDispute({
      ...request.body,
      evidenceDueAt: request.body.evidenceDueAt
        ? new Date(request.body.evidenceDueAt)
        : undefined,
    });
    return reply.code(201).send(dispute);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Failed to create dispute" });
  }
};

export const addEvidenceHandler = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: {
      merchantId: string;
      type: DisputeEvidenceType;
      url?: string;
      textExcerpt?: string;
      metadata?: unknown;
    };
  }>,
  reply: FastifyReply,
) => {
  try {
    const evidence = await disputeService.addEvidence(
      request.params.id,
      request.body,
    );
    return reply.code(201).send(evidence);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Failed to add evidence" });
  }
};

export const listDisputesHandler = async (
  request: FastifyRequest<{
    Querystring: { merchantId: string };
  }>,
  reply: FastifyReply,
) => {
  try {
    if (!request.query.merchantId) {
      return reply.code(400).send({ error: "merchantId required" });
    }
    const disputes = await disputeService.getDisputes(request.query.merchantId);
    return reply.send(disputes);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Failed to list disputes" });
  }
};

export const getDisputeHandler = async (
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply,
) => {
  try {
    const dispute = await disputeService.getDisputeDetails(request.params.id);
    if (!dispute) return reply.code(404).send({ error: "Dispute not found" });
    return reply.send(dispute);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Failed to get dispute" });
  }
};
