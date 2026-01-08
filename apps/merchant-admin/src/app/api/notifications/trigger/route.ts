
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

        // Fallback if relation not ideal, basic user data
        const phone = "2348000000000"; // Mock or fetch from User/Store details
        // In real app, user.phone should exist.

        await NotificationService.sendMilestone(event as NotificationEvent, {
            name: (user as any).name || "Merchant",
            phone: phone, // TODO: Ensure we store phone in User table
            storeName: store?.name || "Your Store",
            storeSlug: store?.slug || "store"
        });
    }

    return NextResponse.json({ success: true });
}
