import Fastify from 'fastify';
import cors from '@fastify/cors';
import { aiRoutes } from './routes';

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get('/health', async () => ({ status: 'ok' }));

// Register Routes
server.register(aiRoutes, { prefix: '/v1/ai' });

const start = async () => {
    try {
        await server.listen({ port: 3006, host: '0.0.0.0' });
        console.log('AI Orchestrator running on port 3006');
    } catch (err) {
        (server.log as any).error(err);
        process.exit(1);
    }
};

start();
