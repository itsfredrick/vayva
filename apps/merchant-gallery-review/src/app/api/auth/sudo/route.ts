import { NextResponse } from "next/server";
import { getSessionUser, COOKIE_NAME } from "@/lib/session";
import { prisma } from "@vayva/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { logAuditEvent, AuditEventType } from "@/lib/audit"; // P11.2

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    // 1. Verify Password
    // Need to fetch user with password from DB (getSessionUser might not return password)
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser || !dbUser.password) {
      return NextResponse.json(
        { error: "User not found or no password" },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(password, dbUser.password);
    if (!isValid) {
      // P11.2: Log failed sudo attempt
      await logAuditEvent(user.storeId, user.id, AuditEventType.SUDO_FAILED, {
        reason: "invalid_password",
      });

      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // 2. Update Session
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Session missing" }, { status: 401 });
    }

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes sudo

    await prisma.merchantSession.update({
      where: { token },
      data: { sudoExpiresAt: expiresAt },
    });

    // P11.2: Log successful sudo
    await logAuditEvent(user.storeId, user.id, AuditEventType.SUDO_SUCCESS, {
      method: "password",
      duration: "10m",
    });

    return NextResponse.json({ success: true, sudoExpiresAt: expiresAt });
  } catch (error) {
    console.error("Sudo Error:", error);
    return NextResponse.json({ error: "Failed to verify" }, { status: 500 });
  }
}
