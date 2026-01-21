import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OpsAuthService } from "@/lib/ops-auth";
export async function GET(req, { params }) {
    try {
        await OpsAuthService.requireSession();
        const { id } = await params;
        const prefs = await prisma.notificationPreference.findUnique({
            where: { storeId: id },
        });
        return NextResponse.json(prefs || { storeId: id, isMuted: false });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
    }
}
export async function POST(req, { params }) {
    try {
        const session = await OpsAuthService.requireSession();
        const { id } = await params;
        const body = await req.json();
        const prefs = await prisma.notificationPreference.upsert({
            where: { storeId: id },
            create: {
                storeId: id,
                ...body,
            },
            update: body,
        });
        // Log audit event
        await prisma.auditLog.create({
            data: {
                storeId: id,
                actorType: "OPS",
                actorId: session.user.id,
                actorLabel: session.user.email || "Ops User",
                action: "NOTIFICATION_PREFS_UPDATED",
                afterState: body,
                correlationId: `prefs-${Date.now()}`,
            },
        });
        return NextResponse.json(prefs);
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
    }
}
