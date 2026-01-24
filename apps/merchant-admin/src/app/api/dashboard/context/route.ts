import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { FEATURES } from "@/lib/env-validation";
export async function GET(request: NextRequest) {
    try {
        // Get real session
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized - Please login" }, { status: 401 });
        }
        // Get store details with integrations
        const store = await prisma.store.findUnique({
            where: { id: user.storeId },
            include: {
                paymentAccounts: true, // For Payment Status
                agent: true, // For WhatsApp Status
            },
        });
        // Get wallet for KYC status
        const wallet = await prisma.wallet.findUnique({
            where: { storeId: user.storeId },
        });
        // Determine Payment Status
        let paymentStatus = "NOT_CONFIGURED";
        if (store?.paymentAccounts?.some((acc) => acc.status === "ACTIVE")) {
            paymentStatus = "CONNECTED";
        }
        // Determine WhatsApp Status
        let whatsappStatus = "NOT_CONFIGURED";
        if (FEATURES.WHATSAPP_ENABLED) {
            if (store?.agent?.enabled) {
                whatsappStatus = "ACTIVE";
            }
            else if (store?.agent) {
                whatsappStatus = "ATTENTION"; // Exists but inactive
            }
        }
        else {
            whatsappStatus = "DISABLED"; // Feature flag off
        }
        // Real context data from database
        const data: any = {
            firstName: user.firstName || "User",
            initials: (user.firstName?.[0] || "U") + (user.lastName?.[0] || ""),
            businessType: store?.category || "UNKNOWN",
            storeStatus: store?.onboardingStatus === "COMPLETE" ? "LIVE" : "DRAFT",
            paymentStatus,
            whatsappStatus,
            kycStatus: wallet?.kycStatus || "NOT_STARTED",
        };
        return NextResponse.json(data);
    }
    catch (error: any) {
        console.error("Dashboard Context Error:", error);
        return NextResponse.json({ error: "Failed to fetch context" }, { status: 500 });
    }
}
