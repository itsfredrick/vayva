import { FastifyPluginAsync } from "fastify";
import { prisma } from "@vayva/db";
import { LoginRequestSchema } from "@vayva/schemas";
import * as bcrypt from "bcryptjs";

const loginRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post("/login", async (request, reply) => {
    const body = LoginRequestSchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return reply.status(401).send({
        error: {
          code: "auth.invalid_credentials",
          message: "Invalid email or password",
        },
      });
    }

    const validPassword = await bcrypt.compare(body.password, user.password);

    if (!validPassword) {
      return reply.status(401).send({
        error: {
          code: "auth.invalid_credentials",
          message: "Invalid email or password",
        },
      });
    }

    const token = fastify.jwt.sign({ id: user.id, email: user.email });

    return {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: `${(user as any).firstName} ${(user as any).lastName}`,
      },
    };
  });
};

export default loginRoute;
