
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { marketingRoutes } from './routes';

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get('/health', async () => ({ status: 'ok' }));

// Register Routes
server.register(marketingRoutes, { prefix: '/v1/marketing' });

const start = async () => {
    try {
        await server.listen({ port: 3018, host: '0.0.0.0' });
        console.log('Marketing Service running on port 3018');
    } catch (err) {
        (server.log as any).error(err);
        process.exit(1);
    }
};

start();
