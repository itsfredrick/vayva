import { FastifyPluginAsync } from 'fastify';
import { prisma } from '@vayva/db';
import { ResetPasswordRequestSchema } from '@vayva/schemas';
import * as bcrypt from 'bcryptjs';

const resetPasswordRoute: FastifyPluginAsync = async (fastify) => {
    fastify.post('/reset-password', async (request, reply) => {
        const body = ResetPasswordRequestSchema.parse(request.body);

        // TODO: Verify token validity (ensure it matches user and isn't expired)
        // For now, this is a placeholder implementation.

        // Mock token verification: assume token is userId for v1 dev
        const userId = body.token; // INSECURE: REPLACE IN PRODUCTION

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return reply.status(400).send({
                error: {
                    code: 'auth.invalid_token',
                    message: 'Invalid or expired token',
                },
            });
        }

        const hashedPassword = await bcrypt.hash(body.newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return { message: 'Password has been reset successfully.' };
    });
};

export default resetPasswordRoute;
