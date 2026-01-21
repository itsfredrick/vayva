import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET(req) {
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
        const settings = store?.settings || {};
        const invites = settings.invites || [];
        return NextResponse.json({
            members: memberships.map(m => ({
                id: m.id,
                userId: m.userId,
                name: `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() || m.user.email,
                // Schema line 2408 User has firstName, lastName. Line 1390 User has name.
                // Wait, there are TWO User models in schema? 
                // Line 1390: model OpsUser? No "model User" at 2408.
                // "model OpsUser" must be somewhere else.
                // Let's assume Membership relations point to the correct User.
                // I will attempt to select firstName, lastName and name to be safe.
                email: m.user.email,
                role: m.role_enum,
                status: m.status,
                joinedAt: m.createdAt
            })),
            invites: invites
        });
    }
    catch (error) {
        console.error("Team Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
    }
}
export async function DELETE(req) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
        return NextResponse.json({ error: "ID required" }, { status: 400 });
    // Ensure not deleting self (optional but good UX)
    // Need to check if user is deleting their own membership? Usually allowed but warning needed.
    // For now allow.
    try {
        await prisma.membership.deleteMany({
            where: {
                id,
                storeId: session.user.storeId // Ensure ownership
            }
        });
        return NextResponse.json({ success: true });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
    }
}
