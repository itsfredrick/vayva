import Fastify from 'fastify';
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true });

// Register CORS
fastify.register(cors);

// Health check endpoint
fastify.get('/health', async () => {
    return { status: 'ok', service: 'compliance-service' };
});

// Placeholder routes - to be implemented
fastify.get('/api/compliance/status', async () => {
    return { message: 'Compliance service - Coming soon' };
});

// Start server
const start = async () => {
    try {
        const port = parseInt(process.env.PORT || '4010');
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log(`Compliance service listening on port ${port}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
