import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { user } = await OpsAuthService.requireSession();
    // Only Viewable by Owner/Admin
    if (!["OPS_OWNER", "OPS_ADMIN"].includes(user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const team = await prisma.opsUser.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true
        },
        orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ data: team });
}

export async function POST(request: Request) {
    const { user } = await OpsAuthService.requireSession();
    // Only Owner can invite new admins
    if (user.role !== "OPS_OWNER") {
        return NextResponse.json({ error: "Unauthorized: Only Owner can invite users" }, { status: 403 });
    }

    const body = await request.json();
    const { email, name, role } = body;

    if (!email || !name || !role) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    try {
        const { user: newUser, tempPassword } = await OpsAuthService.createUser(user.role, { email, name, role });

        await OpsAuthService.logEvent(user.id, "OPS_USER_CREATE", {
            createdUserId: newUser.id,
            role
        });

        // In a real app, we would email this. For now, return it so it can be copied.
        return NextResponse.json({
            data: newUser,
            tempPassword
        });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message || "Failed to create user" }, { status: 500 });
    }
}
