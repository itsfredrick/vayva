import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@vayva/db";

const ROLE_HIERARCHY: Record<string, number> = {
  STAFF: 1,
  SUPPORT: 2,
  FINANCE: 3,
  ADMIN: 4,
  OWNER: 5,
};

export const requirePermission = (requiredPermissionOrRole: string) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const user = req.user as any;
    if (!user) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    // Logic for Merchant Roles
    if (user.aud === "merchant") {
      const storeId =
        (req.headers["x-store-id"] as string) || (req.params as any).storeId;

      if (!storeId) {
        return reply.status(400).send({ error: "Store ID header required" });
      }

      // Fetch dynamic membership for this user/store from DB
      // Include Permissions via Role
      const membership = await prisma.membership.findUnique({
        where: {
          userId_storeId: {
            userId: user.sub,
            storeId,
          },
        },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: true }
              }
            }
          }
        }
      });

      if (!membership) {
        return reply
          .status(403)
          .send({ error: "Forbidden: No access to this store" });
      }

      // 1. Check fine-grained permissions if Role is assigned
      if (membership.role && (membership.role as any).rolePermissions) {
        const permissions = (membership.role as any).rolePermissions.map((rp: any) => rp.permission.key);
        if (permissions.includes(requiredPermissionOrRole)) {
          return; // Authorized via specific permission
        }
      }

      // 2. Fallback: Role Hierarchy Check
      // If the requirement is a role name (legacy), check hierarchy
      const userRolePower = ROLE_HIERARCHY[membership.role_enum] || 0;
      const requiredRolePower = ROLE_HIERARCHY[requiredPermissionOrRole] || 0;

      if (requiredRolePower > 0) {
        if (userRolePower < requiredRolePower) {
          return reply
            .status(403)
            .send({ error: "Forbidden: Insufficient role permissions" });
        }
        return; // Authorized via hierarchy
      }

      // If we are here, it means the requirement was a permission key that the user doesn't have,
      // and it wasn't a known role name.
      // Exception: Owners bypass permission checks? Usually yes.
      if (membership.role_enum === "OWNER") return;

      return reply.status(403).send({ error: `Forbidden: Missing permission ${requiredPermissionOrRole}` });
    }

    // Logic for Ops Roles
    if (user.aud === "ops") {
      if (user.role === "OPS_OWNER" || user.role === "OPS_ADMIN") return;

      if (user.role !== requiredPermissionOrRole) {
        return reply
          .status(403)
          .send({ error: "Forbidden: Insufficient privileges" });
      }
    }
  };
};
