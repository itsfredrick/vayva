import Fastify from 'fastify';
import cors from '@fastify/cors';
import { fulfillmentRoutes } from './api/routes';

const server = Fastify({
    logger: true,
});

server.register(cors);
server.register(fulfillmentRoutes);

// Health Check
server.get('/health', async () => {
    return { status: 'ok', service: 'fulfillment-service' };
});

const start = async () => {
    try {
        await server.listen({ port: 3007, host: '0.0.0.0' });
        console.log('Fulfillment Service running on port 3007');
    } catch (err) {
        (server.log as any).error(err);
        process.exit(1);
    }
};

start();
