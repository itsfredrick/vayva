import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function GET(request: NextRequest) {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let wallet = await prisma.wallet.findUnique({
            where: { storeId: user.storeId },
        });

        if (!wallet) {
            // Create empty wallet if getting summary for first time
            wallet = await prisma.wallet.create({
                data: {
                    storeId: user.storeId,
                },
            });
        }

        return NextResponse.json({
            data: {
                merchantId: user.id, // Using user ID as merchant ID context here
                storeId: user.storeId,
                kycStatus: wallet.kycStatus,
                pinSet: wallet.pinSet,
                isLocked: wallet.isLocked,
                virtualAccount: {
                    status: wallet.vaStatus,
                    bankName: wallet.vaBankName,
                    accountNumber: wallet.vaAccountNumber,
                    accountName: wallet.vaAccountName
                },
                balances: {
                    availableKobo: wallet.availableKobo.toString(),
                    pendingKobo: wallet.pendingKobo.toString(),
                },
            },
        });
    } catch (error) {
        console.error("Wallet Summary error:", error);
        return NextResponse.json(
            { error: "Failed to fetch wallet summary" },
            { status: 500 },
        );
    }
}
