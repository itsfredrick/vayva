
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { onboardingRoutes } from './routes';

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get('/health', async () => ({ status: 'ok' }));

// Register Routes
server.register(onboardingRoutes, { prefix: '/v1/onboarding' });

const start = async () => {
    try {
        await server.listen({ port: 3017, host: '0.0.0.0' });
        console.log('Onboarding Service running on port 3017');
    } catch (err) {
        (server.log as any).error(err);
        process.exit(1);
    }
};

start();
