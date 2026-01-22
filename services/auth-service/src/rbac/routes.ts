import { FastifyInstance } from "fastify";
import { RbacService, PermissionGuard } from "../rbac/service";
import { TeamService } from "../staff/service";

export async function rbacRoutes(server: FastifyInstance) {
  // --- ROLES ---
  // Middleware Factory
  // Middleware Factory: Verifies user permissions via RBAC service
  const ensurePermission = (permission: string) => async (req: unknown, reply: unknown) => {
    // Prioritize authenticated user from JWT if available (Gateway/Local)
    const userId = req.user?.id || req.headers["x-user-id"];
    const storeId = req.headers["x-store-id"];

    if (!userId || !storeId) {
      req.log.warn(`[RBAC] Access attempted without context. User: ${userId}, Store: ${storeId}`);
      return reply.status(401).send({ error: "Unauthenticated" });
    }

    try {
      const allowed = await PermissionGuard.check(userId, storeId, permission);
      if (!allowed) {
        req.log.warn(`[RBAC] Permission denied. User: ${userId}, Perm: ${permission}`);
        return reply.status(403).send({ error: "Forbidden" });
      }
    } catch (err) {
      req.log.error(`[RBAC] Error checking permission: ${err}`);
      return reply.status(500).send({ error: "Internal Authorization Error" });
    }
  };

  // --- ROLES ---
  server.get("/roles", { preHandler: ensurePermission("roles:view") }, async (req: unknown, reply) => {
    const storeId = req.headers["x-store-id"];
    // Logic simplified as middleware handles auth
    const roles = await RbacService.listRoles(storeId);
    return roles;
  });

  server.post("/roles", { preHandler: ensurePermission("roles:manage") }, async (req: unknown, reply) => {
    const storeId = req.headers["x-store-id"];
    const { name, permissions } = req.body;
    const role = await RbacService.createRole(storeId, name, permissions);
    return role;
  });

  // --- PERMISSIONS ---
  server.get("/permissions", async (req, reply) => {
    return await RbacService.listPermissions();
  });

  // --- TEAM ---
  server.get("/team", { preHandler: ensurePermission("team:view") }, async (req: unknown, reply) => {
    const storeId = req.headers["x-store-id"];
    return await TeamService.listMembers(storeId);
  });

  server.post("/team/invite", { preHandler: ensurePermission("team:manage") }, async (req: unknown, reply) => {
    const storeId = req.headers["x-store-id"];
    const { email } = req.body;
    return await TeamService.inviteMember(storeId, email);
  });

  server.delete("/team/:userId", { preHandler: ensurePermission("team:manage") }, async (req: unknown, reply) => {
    const storeId = req.headers["x-store-id"];
    const { userId } = req.params;
    return await TeamService.removeMember(storeId, userId);
  });
}
