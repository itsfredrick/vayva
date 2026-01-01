import { FastifyPluginAsync } from "fastify";
import { prisma } from "@vayva/db";
import { ForgotPasswordRequestSchema } from "@vayva/schemas";

const forgotPasswordRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post("/forgot-password", async (request, reply) => {
    const body = ForgotPasswordRequestSchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { message: "If an account exists, a reset link has been sent." };
    }

    // TODO: Generate reset token and send email (via Queue/Worker)

    return { message: "If an account exists, a reset link has been sent." };
  });
};

export default forgotPasswordRoute;
