import { SessionUser } from "./session";

export enum AppRole {
  VIEWER = "viewer",
  STAFF = "staff",
  ADMIN = "admin",
  OWNER = "owner",
}

type Permission = "read" | "write" | "manage_team" | "initiate_money_movement";

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  [AppRole.VIEWER]: ["read"],
  [AppRole.STAFF]: ["read", "write"],
  [AppRole.ADMIN]: ["read", "write", "manage_team", "initiate_money_movement"],
  [AppRole.OWNER]: ["read", "write", "manage_team", "initiate_money_movement"],
};

export function hasPermission(role: string, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission);
}

export function isRoleAtLeast(
  userRole: string,
  requiredRole: AppRole,
): boolean {
  const roles = [AppRole.VIEWER, AppRole.STAFF, AppRole.ADMIN, AppRole.OWNER];
  const userIndex = roles.indexOf(userRole as AppRole);
  const requiredIndex = roles.indexOf(requiredRole);
  return userIndex >= requiredIndex;
}

export function requireRole(
  user: SessionUser | undefined,
  minimumRole: AppRole,
) {
  if (!user) return false;
  // Assuming user.role contains the role string (e.g. 'staff')
  // If role is undefined, default to viewer or none
  return isRoleAtLeast(user.role || "viewer", minimumRole);
}

export async function authorizeAction(
  user: SessionUser | undefined,
  minimumRole: AppRole,
): Promise<Response | null> {
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!requireRole(user, minimumRole)) {
    return Response.json(
      {
        error: "Forbidden: Insufficient permissions",
        requiredRole: minimumRole,
        currentRole: user.role,
      },
      { status: 403 },
    );
  }
  return null; // Null means authorized
}
