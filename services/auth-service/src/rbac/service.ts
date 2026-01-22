import { prisma } from "@vayva/db";

export const RbacService = {
  // --- Permissions ---
  listPermissions: async () => {
    return await prisma.permission.findMany({
      orderBy: { group: "asc" },
    });
  },

  // --- Roles ---
  listRoles: async (storeId: string) => {
    return await prisma.role.findMany({
      where: {
        OR: [
          { storeId: null }, // System Roles
          { storeId }, // Custom Roles
        ],
      },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });
  },

  createRole: async (
    storeId: string,
    name: string,
    permissionKeys: string[],
  ) => {
    // 1. Get Permission IDs
    const perms = await prisma.permission.findMany({
      where: { key: { in: permissionKeys } },
    });

    // 2. Create Role
    return await prisma.role.create({
      data: {
        storeId,
        name,
        isSystem: false,
        rolePermissions: {
          create: perms.map((p) => ({
            permissionId: p.id,
          })),
        },
      },
      include: { rolePermissions: true },
    });
  },

  updateRole: async (
    storeId: string,
    roleId: string,
    name: string,
    permissionKeys: string[],
  ) => {
    // Verify ownership (cannot edit system roles)
    const role = await prisma.role.findFirst({
      where: { id: roleId, storeId },
    });
    if (!role) throw new Error("Role not found or cannot be edited");
    if (role.isSystem) throw new Error("Cannot edit system roles");

    const perms = await prisma.permission.findMany({
      where: { key: { in: permissionKeys } },
    });

    // Computed Diff update
    return await prisma.role.update({
      where: { id: roleId },
      data: {
        name,
        rolePermissions: {
          deleteMany: {}, // Clear old
          create: perms.map((p) => ({
            permissionId: p.id,
          })), // Add new
        },
      },
    });
  },

  // --- Assignment ---
  assignRole: async (storeId: string, userId: string, roleId: string) => {
    // Check if role exists and is accessible
    const role = await prisma.role.findFirst({
      where: {
        id: roleId,
        OR: [{ storeId: null }, { storeId }],
      },
    });
    if (!role) throw new Error("Invalid Role");

    return await prisma.membership.update({
      where: { userId_storeId: { userId, storeId } },
      data: {
        roleId,
      },
    });
  },
};

export const PermissionGuard = {
  // Middleware helper to check if user has permission
  check: async (
    userId: string,
    storeId: string,
    requiredPermission: string,
  ): Promise<boolean> => {
    const member = await prisma.membership.findUnique({
      where: { userId_storeId: { userId, storeId } },
      include: {
        role: {
          include: { rolePermissions: { include: { permission: true } } },
        },
      },
    });

    if (!member) return false;

    // Owner Override (Legacy Enum or System Role)
    if ((member as unknown).role_enum === "OWNER") return true;

    // Check Role Relation permissions
    if (member.role) {
      // System Role super-admin check?
      if (member.role.name === "Owner") return true;

      const hasPerm = (member.role as unknown).rolePermissions.some(
        (rp: unknown) => rp.permission.key === requiredPermission,
      );
      if (hasPerm) return true;
    }

    return false;
  },
};
