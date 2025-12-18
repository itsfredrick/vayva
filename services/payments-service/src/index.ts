
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { handleStripeWebhook } from './webhooks/handler';

const server = Fastify({
    logger: true,
    // rawBody support needed for stripe
});

server.register(cors);

// Add content type parser for Stripe webhooks
server.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
    try {
        const json = JSON.parse(body as string);
        (req as any).rawBody = body; // Attach raw string for signature verification
        done(null, json);
    } catch (err: any) {
        err.statusCode = 400;
        done(err, undefined);
    }
});

server.get('/health', async () => {
    return { status: 'ok', service: 'payments-service' };
});

server.post('/webhooks/stripe', handleStripeWebhook);

const start = async () => {
    try {
        await server.listen({ port: 3006, host: '0.0.0.0' });
        console.log('Payments Service running on port 3006');
    } catch (err) {
        (server.log as any).error(err);
        process.exit(1);
    }
};

start();
