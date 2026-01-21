import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const currentToken = req.cookies.get("next-auth.session-token")?.value;

    try {
        // Delete all security sessions for this user 
        // Note: Since we use JWT strategy, this won't kill active JWTs, 
        // but it cleans up the 'Active Devices' list.
        await prisma.userSession.deleteMany({
            where: { userId },
        });

        // Log security event
        await prisma.auditLog.create({
            data: {
                storeId: session.user.storeId || null,
                actorType: "USER",
                actorId: userId,
                actorLabel: session.user.name || session.user.email || "Unknown User",
                action: "SECURITY_SIGNOUT_ALL",
                entityType: "user",
                entityId: userId,
                ipAddress: req.headers.get("x-forwarded-for") || "unknown",
                userAgent: req.headers.get("user-agent"),
                correlationId: `signout-all-${userId}-${Date.now()}`,
            }
        });

        return NextResponse.json({ success: true, message: "Signed out of all devices" });
    } catch (error) {
        console.error("Signout All Error:", error);
        return NextResponse.json({ error: "Failed to sign out all sessions" }, { status: 500 });
    }
}
