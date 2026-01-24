import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { PaystackService } from "@/lib/payment/paystack";

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        const bankAccount = await prisma.bankBeneficiary.findFirst({
            where: { storeId, isDefault: true },
        });

        if (!bankAccount) {
            return NextResponse.json({});
        }

        return NextResponse.json({
            bankName: bankAccount.bankName,
            accountNumber: bankAccount.accountNumber,
            accountName: bankAccount.accountName,
            bankCode: bankAccount.bankCode
        });
    }
    catch (error: any) {
        console.error("Fetch bank error:", error);
        return NextResponse.json({ error: "Failed to fetch bank account" }, { status: 500 });
    }
}

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
        const { accountNumber, bankCode, bankName } = body;

        if (!accountNumber || !bankCode) {
            return NextResponse.json({ error: "Account number and bank code required" }, { status: 400 });
        }

        // 1. Verify with Paystack
        let resolvedAccount;
        try {
            resolvedAccount = await PaystackService.resolveAccount(accountNumber, bankCode);
        } catch (e: any) {
            console.error("Paystack resolution failed:", e.message);
            return NextResponse.json({ error: "Could not verify account details. Please check the number and try again." }, { status: 400 });
        }

        const verifiedAccountName = resolvedAccount.account_name;

        // 2. Save to DB (BankBeneficiary)
        // Deactivate others
        await prisma.bankBeneficiary.updateMany({
            where: { storeId, isDefault: true },
            data: { isDefault: false }
        });

        const account = await prisma.bankBeneficiary.create({
            data: {
                storeId,
                bankName: bankName || "Unknown Bank", // Paystack resolve doesn't return bank name usually, client should send it or we fetch from bank list
                accountNumber,
                accountName: verifiedAccountName,
                bankCode,
                isDefault: true
            }
        });

        return NextResponse.json(account);
    }
    catch (error: any) {
        console.error("Save bank error:", error);
        return NextResponse.json({ error: "Failed to save bank account" }, { status: 500 });
    }
}
