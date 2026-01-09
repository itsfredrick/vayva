
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { NotificationService, NotificationEvent } from "@/services/notifications";
import { prisma } from "@vayva/db";

export async function POST(req: NextRequest) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { event } = await req.json();

    if (event === "onboarding_complete" || event === "first_sale") {
        // Fetch fresh details
        const store: any = await prisma.store.findUnique({
            where: { id: user.storeId },
        });

        // Fetch user for phone
        const fullUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { phone: true, firstName: true }
        });

        const phone = fullUser?.phone || "2348000000000";
        const merchantName = fullUser?.firstName || (user as any).name || "Merchant";

        await NotificationService.sendMilestone(event as NotificationEvent, {
            name: merchantName,
            phone: phone,
            storeName: store?.name || "Your Store",
            storeSlug: store?.slug || "store"
        });
    }

    return NextResponse.json({ success: true });
}
