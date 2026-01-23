import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        // Fetch Active Members
        const memberships = await prisma.membership.findMany({
            where: { storeId: session.user.storeId },
            include: {
                user: {
                    select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        // Fetch Pending Invites from Settings
        const store = await prisma.store.findUnique({
            where: { id: session.user.storeId },
            select: { settings: true }
        });
        const settings: any = store?.settings || {};
        const invites = settings.invites || [];
        return NextResponse.json({
            members: memberships.map((m: any) => ({
                id: m.id,
                userId: m.userId,
                name: `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() || m.user.email,
                email: m.user.email,
                role: m.role_enum,
                status: m.status,
                joinedAt: m.createdAt
            })),
            invites: invites
        });
    }
    catch (error: any) {
        console.error("Team Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
        return NextResponse.json({ error: "ID required" }, { status: 400 });
    try {
        await prisma.membership.deleteMany({
            where: {
                id,
                storeId: session.user.storeId // Ensure ownership
            }
        });
        return NextResponse.json({ success: true });
    }
    catch (error: any) {
        return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
    }
}
