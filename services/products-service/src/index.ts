import Fastify from 'fastify';
import cors from '@fastify/cors';
import { productRoutes } from './routes';

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get('/health', async () => ({ status: 'ok' }));

// Register Routes
server.register(productRoutes, { prefix: '/v1/products' });

const start = async () => {
    try {
        await server.listen({ port: 3009, host: '0.0.0.0' });
        console.log('Products Service running on port 3009');
    } catch (err) {
        (server.log as any).error(err);
        process.exit(1);
    }
};

start();
