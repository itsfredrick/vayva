import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { user } = await OpsAuthService.requireSession();
    if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await params;

    const supportCase = await prisma.supportCase.findUnique({
        where: { id }
    });

    if (!supportCase) return new NextResponse("Not Found", { status: 404 });

    const store = await prisma.store.findUnique({
        where: { id: supportCase.storeId },
        select: { id: true, name: true, slug: true, logoUrl: true }
    });

    const profile = await prisma.storeProfile.findUnique({
        where: { storeId: supportCase.storeId },
        select: { whatsappNumberE164: true }
    });

    const storeData = store ? { ...store, whatsappNumberE164: profile?.whatsappNumberE164 } : null;

    return NextResponse.json({ data: { ...supportCase, store: storeData } });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { user } = await OpsAuthService.requireSession();
    if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await params;

    const body = await request.json();
    const { status, note } = body;

    const updated = await prisma.supportCase.update({
        where: { id },
        data: {
            status: status,
            updatedAt: new Date(),
            // Append note to existing json 'links' or a specific 'notes' field if we had one.
            // Seeing schema has only 'links', we'll abuse it for now or assume schema expansion.
            // For now, let's just update status.
        }
    });

    // Log the interaction
    await OpsAuthService.logEvent(user.id, "SUPPORT_UPDATE", {
        caseId: id,
        newStatus: status,
        note
    });

    return NextResponse.json({ success: true, data: updated });
}
