import { FastifyPluginAsync } from "fastify";
import { prisma } from "@vayva/db";
import { ResetPasswordRequestSchema } from "@vayva/schemas";
import * as bcrypt from "bcryptjs";

const resetPasswordRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post("/reset-password", async (request, reply) => {
    const body = ResetPasswordRequestSchema.parse(request.body);

    // TODO: Verify token validity (ensure it matches user and isn't expired)
    // For now, this is a placeholder implementation.

    // Secure implementation required
    // const userId = await verifyToken(body.token);
    return reply.status(501).send({ error: "Password reset handling not yet implemented in production." });

    /*
    const user = await prisma.user.findUnique({
      where: { id: "placeholder" },
    });
    */

    return { message: "Password has been reset successfully." };
  });
};

export default resetPasswordRoute;
