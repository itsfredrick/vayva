
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { marketplaceRoutes } from './routes';

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get('/health', async () => ({ status: 'ok' }));

// Register Routes
server.register(marketplaceRoutes, { prefix: '/v1/marketplace' });

const start = async () => {
    try {
        await server.listen({ port: 3019, host: '0.0.0.0' });
        console.log('Marketplace Service running on port 3019');
    } catch (err) {
        (server.log as any).error(err);
        process.exit(1);
    }
};

start();
