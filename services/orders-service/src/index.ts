import Fastify from 'fastify';
import cors from '@fastify/cors';
import { orderRoutes } from './routes';

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get('/health', async () => ({ status: 'ok' }));

// Register Routes
server.register(orderRoutes, { prefix: '/v1/orders' });

const start = async () => {
    try {
        await server.listen({ port: 3012, host: '0.0.0.0' });
        console.log('Orders Service running on port 3012');
    } catch (err) {
        (server.log as any).error(err);
        process.exit(1);
    }
};

start();
