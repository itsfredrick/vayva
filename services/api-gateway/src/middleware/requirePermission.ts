import { FastifyRequest, FastifyReply } from "fastify";

export const requirePermission = (requiredRole: string) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const user = req.user as any;
    if (!user) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    // Logic for Merchant Roles
    if (user.aud === "merchant") {
      // Logic to check membership role for the active store context
      // This implies the request has an activeStoreId from headers or params
      const storeId =
        (req.headers["x-store-id"] as string) || (req.params as any).storeId;

      // If storeId is required by the endpoint but missing
      if (!storeId) {
        // Some endpoints might be cross-store (e.g. "list my stores"),
        // so strictly enforcing here depends on route config.
        // For now, if we require permission, we assume store context is needed.
        return reply.status(400).send({ error: "Store ID header required" });
      }

      const allowedStores = user.memberships || []; // Array of storeIds
      if (!allowedStores.includes(storeId)) {
        return reply
          .status(403)
          .send({ error: "Forbidden: No access to this store" });
      }

      // TODO: Check fine-grained role (Owner/Admin/Staff) vs requiredRole
    }

    // Logic for Ops Roles
    if (user.aud === "ops") {
      if (user.role !== requiredRole && user.role !== "OPS_ADMIN") {
        // OPS_ADMIN allowed everything
        return reply
          .status(403)
          .send({ error: "Forbidden: Insufficient privileges" });
      }
    }
  };
};
