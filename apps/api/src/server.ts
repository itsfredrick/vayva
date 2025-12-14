import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './lib/config';
import { prisma } from '@vayva/db';

const server = Fastify({
    logger: true
});

server.register(cors);

server.get('/health', async () => {
    return { status: 'ok' };
});

// Stubs for Auth
server.post('/auth/signup', async (request, reply) => {
    return { message: 'Signup stub' };
});
server.post('/auth/login', async (request, reply) => {
    return { message: 'Login stub' };
});

// Stubs for Webhooks
server.post('/webhooks/paystack', async (request, reply) => {
    // TODO: Verify signature
    // TODO: Idempotency check
    return { status: 'received' };
});

server.post('/webhooks/whatsapp', async (request, reply) => {
    // TODO: Verify signature
    // TODO: Forward to worker
    return { status: 'received' };
});

const start = async () => {
    try {
        await server.listen({ port: parseInt(config.PORT) || 4000, host: '0.0.0.0' });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
