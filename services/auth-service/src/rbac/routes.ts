import { FastifyInstance } from "fastify";
import { RbacService, PermissionGuard } from "../rbac/service";
import { TeamService } from "../staff/service";

export async function rbacRoutes(server: FastifyInstance) {
  // --- ROLES ---
  server.get("/roles", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    if (!storeId) return reply.status(400).send({ error: "Store ID required" });

    const roles = await RbacService.listRoles(storeId);
    return roles;
  });

  server.post("/roles", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    const { name, permissions } = req.body;
    // Auth check: Only Owner/Admin (TODO: Real Middleware)

    const role = await RbacService.createRole(storeId, name, permissions);
    return role;
  });

  // --- PERMISSIONS ---
  server.get("/permissions", async (req, reply) => {
    return await RbacService.listPermissions();
  });

  // --- TEAM ---
  server.get("/team", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    if (!storeId) return reply.status(400).send({ error: "Store ID required" });

    return await TeamService.listMembers(storeId);
  });

  server.post("/team/invite", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    const { email } = req.body;

    return await TeamService.inviteMember(storeId, email);
  });

  server.delete("/team/:userId", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    const { userId } = req.params;
    return await TeamService.removeMember(storeId, userId);
  });
}
