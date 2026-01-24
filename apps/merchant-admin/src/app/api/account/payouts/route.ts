import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        const { checkFeatureAccess } = await import("@/lib/auth/gating");
        const access = await checkFeatureAccess(storeId, "payouts");

        if (!access.allowed) {
            return NextResponse.json({ error: access.reason }, { status: 403 });
        }

        const body = await request.json();
        const amount = Number(body.amount);

        if (isNaN(amount) || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        // 1. Get default bank account
        const bankAccount = await prisma.bankBeneficiary.findFirst({
            where: { storeId, isDefault: true }
        });

        if (!bankAccount) {
            return NextResponse.json({ error: "No bank account set for payouts" }, { status: 400 });
        }

        // 2. Create Payout record
        const payout = await prisma.payout.create({
            data: {
                storeId,
                amount,
                currency: "NGN",
                status: "PENDING",
                provider: "MANUAL",
                providerPayoutId: `man_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                reference: `pay_${Date.now()}_${storeId.substring(0, 4)}`,
                destination: {
                    bankName: bankAccount.bankName,
                    accountNumber: bankAccount.accountNumber,
                    accountName: bankAccount.accountName,
                    bankCode: bankAccount.bankCode
                } as any
            }
        });

        return NextResponse.json({
            id: payout.id,
            status: payout.status,
            amount: payout.amount,
            reference: payout.reference
        });
    }
    catch (error: any) {
        console.error("Payout error:", error);
        return NextResponse.json({ error: "Payout initiation failed" }, { status: 500 });
    }
}
