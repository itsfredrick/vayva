import { UserRole } from "@vayva/shared";

export function hasPermission(
  role: UserRole,
  _resource: string,
  _action: string,
) {
  // Pending implementation
  if (role === UserRole.OWNER) return true;
  return false;
}
