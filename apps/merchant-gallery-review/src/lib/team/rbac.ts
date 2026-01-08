import { getSessionUser } from "@/lib/session";
import { can } from "./permissions";
import { NextResponse } from "next/server";

export async function checkPermission(action: string) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const userRole = user.role;
  if (!can(userRole, action)) {
    throw new Error("Forbidden: Insufficient permissions");
  }

  // Test session object structure for compatibility with existing handlers
  return { user };
}

export function withRBAC(action: string, handler: Function) {
  return async (...args: any[]) => {
    try {
      const session = await checkPermission(action);
      return await handler(session, ...args);
    } catch (error: any) {
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message.includes("Forbidden")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      throw error;
    }
  };
}
