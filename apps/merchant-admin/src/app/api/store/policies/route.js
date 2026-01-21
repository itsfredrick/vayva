import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
export async function GET() {
    try {
        const session = await requireAuth();
        const store = await prisma.store.findUnique({
            where: { id: session.user.storeId },
            select: { settings: true },
        });
        const settings = store?.settings || {};
        const policies = settings.policies || {
            refundPolicy: "",
            shippingPolicy: "",
            termsOfService: "",
            privacyPolicy: "",
        };
        return NextResponse.json(policies);
    }
    catch (error) {
        console.error("Fetch policies error:", error);
        return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 });
    }
}
export async function PATCH(request) {
    try {
        const session = await requireAuth();
        const body = await request.json();
        // Fetch current settings to merge
        const store = await prisma.store.findUnique({
            where: { id: session.user.storeId },
            select: { settings: true },
        });
        const currentSettings = store?.settings || {};
        const updatedPolicies = { ...(currentSettings.policies || {}), ...body };
        const updatedSettings = {
            ...currentSettings,
            policies: updatedPolicies,
        };
        await prisma.store.update({
            where: { id: session.user.storeId },
            data: { settings: updatedSettings },
        });
        return NextResponse.json(updatedPolicies);
    }
    catch (error) {
        console.error("Update policies error:", error);
        return NextResponse.json({ error: "Failed to update policies" }, { status: 500 });
    }
}
