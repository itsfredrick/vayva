import { FastifyInstance, FastifyRequest } from "fastify";
import { RbacService, PermissionGuard } from "../rbac/service";
import { TeamService } from "../staff/service";

export async function rbacRoutes(server: FastifyInstance) {
  // --- ROLES ---
  // Middleware Factory
  // Middleware Factory: Verifies user permissions via RBAC service
  const ensurePermission = (permission: string) => async (req: FastifyRequest, reply: any) => {
    const userId = (req as any).user?.id || (req.headers["x-user-id"] as string | undefined);
    const storeId = req.headers["x-store-id"] as string;

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
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      req.log.error(`[RBAC] Error checking permission: ${error.message}`);
      return reply.status(500).send({ error: "Internal Authorization Error" });
    }
  };

  // --- ROLES ---
  server.get("/roles", { preHandler: ensurePermission("roles:view") }, async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const roles = await RbacService.listRoles(storeId);
    return roles;
  });

  server.post<{ Body: { name: string; permissions: string[] } }>(
    "/roles",
    { preHandler: ensurePermission("roles:manage") },
    async (req, _reply) => {
      const storeId = req.headers["x-store-id"] as string;
      const { name, permissions } = req.body;
      const role = await RbacService.createRole(storeId, name, permissions);
      return role;
    },
  );

  // --- PERMISSIONS ---
  server.get("/permissions", async (_req, _reply) => {
    return await RbacService.listPermissions();
  });

  // --- TEAM ---
  server.get("/team", { preHandler: ensurePermission("team:view") }, async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await TeamService.listMembers(storeId);
  });

  server.post<{ Body: { email: string } }>(
    "/team/invite",
    { preHandler: ensurePermission("team:manage") },
    async (req, _reply) => {
      const storeId = req.headers["x-store-id"] as string;
      const { email } = req.body;
      return await TeamService.inviteMember(storeId, email);
    },
  );

  server.delete<{ Params: { userId: string } }>(
    "/team/:userId",
    { preHandler: ensurePermission("team:manage") },
    async (req, _reply) => {
      const storeId = req.headers["x-store-id"] as string;
      const { userId } = req.params;
      return await TeamService.removeMember(storeId, userId);
    },
  );
}
