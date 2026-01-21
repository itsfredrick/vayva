import Fastify from "fastify";
import cors from "@fastify/cors";
import { validateStoreCompliance } from "@vayva/compliance";
import { z } from "zod";

const fastify = Fastify({
    logger: true,
});

fastify.register(cors);

const validateParamsSchema = z.object({
    storeId: z.string(),
});

fastify.post("/v1/validate/:storeId", async (request, reply) => {
    try {
        const { storeId } = validateParamsSchema.parse(request.params);
        const report = await validateStoreCompliance(storeId);

        return reply.send({
            success: true,
            report,
        });
    } catch (error: any) {
        fastify.log.error(error);
        return reply.status(error.name === "ZodError" ? 400 : 500).send({
            success: false,
            error: error.message || "Internal server error",
        });
    }
});

fastify.get("/health", async () => {
    return { status: "ok" };
});

const start = async () => {
    try {
        await fastify.listen({ port: 3015, host: "0.0.0.0" });
        console.log("Compliance Service listening on port 3015");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
