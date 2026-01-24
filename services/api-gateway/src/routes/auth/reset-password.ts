import { FastifyPluginAsync } from "fastify";
import { prisma } from "@vayva/db";
import { ResetPasswordRequestSchema } from "@vayva/schemas";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const resetPasswordRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post("/reset-password", async (request, reply) => {
    const body = ResetPasswordRequestSchema.parse(request.body);

    // 1. Verify Token first (we need ID from it or search user by ID form query?)
    // The previous implementation constructed link: ...?token=...&id=...
    // If id is in query, we should use req.query. But schema parsing body?
    // Let's assume we decode token to get ID, OR we need to accept ID in body.
    // Schema only has token/newPassword.
    // So we must decode token.

    // Decode without verify first to get ID for secret lookup? 
    // Or just use global secret? 
    // forgot-password uses: secret = app_secret + user.password.
    // This is circular: we need user to get secret, we need secret to verify token to get user?
    // Use `jwt.decode` to get payload { id }, find user, generate secret, verify.

    const decoded = jwt.decode(body.token) as { id?: string } | null;
    if (!decoded || !decoded.id) {
      return reply.status(400).send({ error: "Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return reply.status(400).send({ error: "User not found" });
    }

    // 2. Verify Token
    // Secret must match the one used in forgot-password (app secret + current password hash)
    const secret = (process.env.JWT_SECRET || "supersecret") + user.password;

    try {
      jwt.verify(body.token, secret);
    } catch (// eslint-disable-next-line @typescript-eslint/no-unused-vars
    _e) {
      return reply.status(400).send({
        error: "Invalid or expired token",
        code: "TOKEN_INVALID"
      });
    }

    // 3. Hash and Update
    const hashedPassword = await bcrypt.hash(body.newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { message: "Password has been reset successfully." };
  });
};

export default resetPasswordRoute;
