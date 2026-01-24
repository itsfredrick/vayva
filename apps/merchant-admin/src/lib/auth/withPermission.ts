import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

// Define roles or use string
type Role = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

const ROLE_HIERARCHY: Record<Role, number> = {
    OWNER: 4,
    ADMIN: 3,
    EDITOR: 2,
    VIEWER: 1,
};

export async function withPermission(requiredRole: Role) {
    const user = await getSessionUser();
    if (!user) {
        redirect("/auth/login");
    }

    // Check role from session user
    // Assuming user.role is the role Enum or string
    const userRole = (user as any).role || "VIEWER";

    if (ROLE_HIERARCHY[userRole as Role] < ROLE_HIERARCHY[requiredRole]) {
        redirect("/dashboard"); // or 403 page
    }

    return user;
}
