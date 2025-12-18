import Fastify from 'fastify';
import cors from '@fastify/cors';
import { approvalRoutes } from './routes';

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get('/health', async () => ({ status: 'ok' }));

// Register Routes
server.register(approvalRoutes, { prefix: '/v1/approvals' });

const start = async () => {
    try {
        await server.listen({ port: 3007, host: '0.0.0.0' });
        console.log('Approvals Service running on port 3007');
    } catch (err) {
        (server.log as any).error(err);
        process.exit(1);
    }
};

start();
