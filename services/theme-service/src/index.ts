
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { themeRoutes } from './routes';

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get('/health', async () => ({ status: 'ok' }));

// Register Routes
server.register(themeRoutes, { prefix: '/v1/themes' });

const start = async () => {
    try {
        await server.listen({ port: 3020, host: '0.0.0.0' });
        console.log('Theme Service running on port 3020');
    } catch (err) {
        (server.log as any).error(err);
        process.exit(1);
    }
};

start();
