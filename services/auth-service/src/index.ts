import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { merchantRoutes } from './merchant/routes';
import { customerRoutes } from './customer/routes';
import { opsRoutes } from './ops/routes';
import { staffRoutes } from './staff/routes';
import { onboardingRoutes } from './onboarding/routes';
import { rbacRoutes } from './rbac/routes';

const server = Fastify({ logger: true });

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

server.register(cors);
server.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret',
});

server.decorate('authenticate', async (request: any, reply: any) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.send(err);
    }
});

// Health check
server.get('/health', async () => ({ status: 'ok' }));

// Register Routes
server.register(merchantRoutes, { prefix: '/v1/auth/merchant' });
server.register(customerRoutes, { prefix: '/v1/auth/customer' });
server.register(opsRoutes, { prefix: '/v1/auth/ops' });
server.register(staffRoutes, { prefix: '/v1/staff' });
server.register(onboardingRoutes, { prefix: '/v1/onboarding' });
server.register(rbacRoutes, { prefix: '/v1/rbac' });

const start = async () => {
    try {
        await server.listen({ port: 3011, host: '0.0.0.0' });
        console.log('Auth Service running on port 3011');
    } catch (err) {
        (server.log as any).error(err);
        process.exit(1);
    }
};

start();
