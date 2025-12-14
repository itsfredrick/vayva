import { UserRole } from '@vayva/shared';

export function hasPermission(role: UserRole, resource: string, action: string) {
    // Stub implementation
    if (role === UserRole.OWNER) return true;
    return false;
}
