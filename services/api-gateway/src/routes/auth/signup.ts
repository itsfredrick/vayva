import { FastifyPluginAsync } from 'fastify';
import { prisma } from '@vayva/db';
import { SignupRequestSchema } from '@vayva/schemas';
import * as bcrypt from 'bcryptjs';

const signupRoute: FastifyPluginAsync = async (fastify) => {
    fastify.post('/signup', async (request, reply) => {
        const body = SignupRequestSchema.parse(request.body);

        const existingUser = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (existingUser) {
            return reply.status(409).send({
                error: {
                    code: 'auth.email_taken',
                    message: 'Email already in use',
                },
            });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
                firstName: body.firstName,
                lastName: body.lastName,
            },
        });

        const token = fastify.jwt.sign({ id: user.id, email: user.email });

        return {
            message: 'User created successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
            },
        };
    });
};

export default signupRoute;
