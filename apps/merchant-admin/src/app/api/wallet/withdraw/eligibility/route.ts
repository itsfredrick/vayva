import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        const store = await prisma.store.findUnique({
            where: { id: storeId },
            include: { wallet: true }
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const kycStatus = store.kycStatus || "NOT_STARTED";
        const isEligible = kycStatus === "VERIFIED";
        const blocks = [];

        if (!isEligible) {
            blocks.push("KYC Verification Required");
        }

        if (!store.wallet || store.wallet.availableKobo <= 0) {
            blocks.push("Insufficient balance");
        }

        return NextResponse.json({
            kycStatus: kycStatus.toLowerCase(),
            availableBalance: Number(store.wallet?.availableKobo || 0) / 100, // Denormalize kobo
            minWithdrawal: 1000,
            blockedReasons: blocks,
            isEligible: isEligible && blocks.length === 0,
        });
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
