import { FastifyRequest, FastifyReply } from 'fastify';
import { returnService } from '../services/return-service';
// import { ReturnReason, ReturnResolution, ReturnMethod, ReturnStatus } from '@prisma/client';

export const createReturnHandler = async (request: FastifyRequest<{
    Body: {
        merchantId: string;
        orderId: string;
        customerId?: string;
        reasonCode: any;
        reasonText?: string;
        resolutionType: any;
        items: any;
        logistics: {
            method: any;
            pickupAddress?: any;
            dropoffInstructions?: string;
        }
    }
}>, reply: FastifyReply) => {
    try {
        const returnReq = await returnService.createReturnRequest(request.body);
        return reply.code(201).send(returnReq);
    } catch (error) {
        (request.log as any).error(error);
        return reply.code(500).send({ error: 'Failed to create return request' });
    }
};

export const updateReturnStatusHandler = async (request: FastifyRequest<{
    Params: { id: string };
    Body: { status: any }
}>, reply: FastifyReply) => {
    try {
        const updated = await returnService.updateStatus(request.params.id, request.body.status);
        return reply.send(updated);
    } catch (error) {
        (request.log as any).error(error);
        return reply.code(500).send({ error: 'Failed to update return status' });
    }
};

export const listReturnsHandler = async (request: FastifyRequest<{
    Querystring: { merchantId: string }
}>, reply: FastifyReply) => {
    try {
        if (!request.query.merchantId) {
            return reply.code(400).send({ error: 'merchantId required' });
        }
        const returns = await returnService.getReturnRequests(request.query.merchantId);
        return reply.send(returns);
    } catch (error) {
        (request.log as any).error(error);
        return reply.code(500).send({ error: 'Failed to list returns' });
    }
};
