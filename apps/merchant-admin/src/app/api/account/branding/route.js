import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: { logoUrl: true, settings: true },
        });
        if (!store)
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        const settings = store.settings || {};
        const branding = settings.branding || {};
        return NextResponse.json({
            logoUrl: store.logoUrl || "",
            primaryColor: branding.primaryColor || "#22C55E",
            accentColor: branding.accentColor || "#16A34A",
        });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to fetch branding" }, { status: 500 });
    }
}
export async function PUT(req) {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;
        const body = await req.json();
        const { logoUrl, primaryColor, accentColor } = body;
        // Get current settings
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: { settings: true, logoUrl: true },
        });
        const currentSettings = store?.settings || {};
        const currentBranding = currentSettings.branding || {};
        // Merge logic
        const updatedSettings = {
            ...currentSettings,
            branding: {
                ...currentBranding,
                primaryColor,
                accentColor,
            },
        };
        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: {
                logoUrl: logoUrl || store?.logoUrl, // Only update if provided
                settings: updatedSettings,
            },
        });
        // Audit Log
        const { logAuditEvent, AuditEventType } = await import("@/lib/audit");
        await logAuditEvent(storeId, session.user.id, AuditEventType.SETTINGS_CHANGED, {
            targetType: "STORE",
            targetId: storeId,
            meta: { keysChanged: ["branding"] }
        });
        return NextResponse.json({
            success: true,
            branding: updatedSettings.branding,
        });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to save branding" }, { status: 500 });
    }
}
