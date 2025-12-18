import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma, PaymentStatus } from '@vayva/db';
import axios from 'axios';
import * as crypto from 'crypto';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_mock';
const IS_TEST_MODE = !process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_MOCK === 'true';

const verifySchema = z.object({
    reference: z.string(),
    storeId: z.string(),
});

const initializeSchema = z.object({
    orderId: z.string(),
    email: z.string().email(),
    amount: z.number(), // In Kobo
    currency: z.string().default('NGN'),
    callbackUrl: z.string().optional(),
    metadata: z.any().optional()
});

export const initializeTransactionHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = initializeSchema.parse(req.body);

    const order = await prisma.order.findUnique({ where: { id: body.orderId } });
    if (!order) return reply.status(404).send({ error: 'Order not found' });

    const reference = `vva_${crypto.randomBytes(8).toString('hex')}`;

    // Create Transaction Record in INITIATED state
    await prisma.paymentTransaction.create({
        data: {
            storeId: order.storeId,
            orderId: body.orderId,
            reference,
            amount: body.amount,
            currency: body.currency,
            status: 'INITIATED',
            provider: 'PAYSTACK',
            type: 'CHARGE',
            metadata: body.metadata || {}
        }
    });

    if (IS_TEST_MODE) {
        return reply.send({
            status: true,
            message: "Test Mode: Authorization URL created",
            data: {
                authorization_url: `http://localhost:3001/paystack-mock?reference=${reference}&amount=${body.amount}`,
                access_code: "mock_access_code",
                reference
            }
        });
    }

    try {
        const response = await axios.post('https://api.paystack.co/transaction/initialize', {
            email: body.email,
            amount: body.amount,
            reference,
            callback_url: body.callbackUrl,
            metadata: {
                ...body.metadata,
                orderId: body.orderId,
                storeId: order.storeId
            }
        }, {
            headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
        });

        return reply.send(response.data);
    } catch (error: any) {
        console.error('Paystack Initialize Error:', error.response?.data || error.message);
        return reply.status(500).send({ error: 'Failed to initialize payment' });
    }
};

export const verifyPaymentHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { reference } = verifySchema.parse(req.body);

    const tx = await prisma.paymentTransaction.findUnique({
        where: { reference }
    });

    if (!tx) return reply.status(404).send({ error: 'Transaction not found' });
    if (tx.status === 'VERIFIED' || tx.status === 'SUCCESS') {
        return reply.send({ status: tx.status, transaction: tx });
    }

    let paystackData;
    if (IS_TEST_MODE) {
        paystackData = { status: 'success', reference };
    } else {
        try {
            const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
            });
            paystackData = response.data.data;
        } catch (error: any) {
            console.error('Paystack Verify Error:', error.response?.data || error.message);
            return reply.status(500).send({ error: 'Failed to verify payment' });
        }
    }

    if (paystackData.status === 'success') {
        await processSuccessfulPayment(tx, paystackData);
        const updated = await prisma.paymentTransaction.findUnique({ where: { id: tx.id } });
        return reply.send({ status: 'SUCCESS', transaction: updated });
    }

    return reply.send({ status: 'FAILED', transaction: tx });
};

export const webhookHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const signature = req.headers['x-paystack-signature'] as string;

    // In test mode without key, we might skip signature check for internal test endpoint
    if (!IS_TEST_MODE || signature) {
        const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash !== signature) {
            return reply.status(401).send({ error: 'Invalid signature' });
        }
    }

    const event = req.body as any;
    console.log('Paystack Webhook Received:', event.event);

    if (event.event === 'charge.success') {
        const reference = event.data.reference;
        const tx = await prisma.paymentTransaction.findUnique({ where: { reference } });

        if (tx && tx.status !== 'SUCCESS' && tx.status !== 'VERIFIED') {
            await processSuccessfulPayment(tx, event.data);
        }
    }

    return reply.send({ status: 'success' });
};

async function processSuccessfulPayment(tx: any, paystackData: any) {
    // 1. Update Transaction
    await prisma.paymentTransaction.update({
        where: { id: tx.id },
        data: {
            status: 'SUCCESS',
            metadata: paystackData as any
        }
    });

    // 2. Update Order via Internal Request (or direct Prisma if common DB)
    // For V1 we use direct Prisma since they share the DB
    await prisma.order.update({
        where: { id: tx.orderId },
        data: {
            paymentStatus: 'SUCCESS',
            status: 'PAID'
        }
    });

    // 3. Create Timeline Event
    await prisma.orderTimelineEvent.create({
        data: {
            orderId: tx.orderId,
            title: 'PAYMENT_CONFIRMED',
            body: `Payment of ${tx.currency} ${tx.amount / 100} confirmed via Paystack. Ref: ${tx.reference}`,
        }
    });

    // 4. Create Receipt
    const receiptNumber = `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await prisma.receipt.create({
        data: {
            orderId: tx.orderId,
            url: `https://dash.vayva.app/receipts/${receiptNumber}`,
        }
    });

    // 5. Trigger Notifications (Emit event or direct call)
    // TODO: Notify Notifications Service
}

export const listTransactionsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    if (!storeId) return reply.status(400).send({ error: 'Store ID required' });

    const transactions = await prisma.paymentTransaction.findMany({
        where: { storeId },
        include: {
            order: {
                include: { customer: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return reply.send(transactions);
};

