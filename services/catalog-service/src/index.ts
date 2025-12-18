
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { catalogRoutes } from './api/routes';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const server = Fastify({
    logger: true
});

// Database Client
// export const prisma = new PrismaClient(); // Use @vayva/db

const start = async () => {
    try {
        await server.register(cors, {
            origin: true // Allow all for V1
        });

        // Register Routes
        await server.register(catalogRoutes, { prefix: '/api' });

        const port = process.env.PORT ? parseInt(process.env.PORT) : 3004;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Catalog Service running on port ${port}`);
    } catch (err) {
        (server.log as any).error(err);
        process.exit(1);
    }
};

start();
