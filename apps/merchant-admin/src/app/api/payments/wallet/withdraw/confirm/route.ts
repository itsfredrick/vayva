import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma, Prisma } from "@vayva/db";

export async function POST(request: NextRequest) {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { withdrawalId, otpCode } = await request.json();

        if (!withdrawalId || !otpCode) {
            return NextResponse.json({ error: "Missing ID or OTP" }, { status: 400 });
        }

        // 1. Find Withdrawal
        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id: withdrawalId },
            include: { store: true } // Ensure store context
        });

        if (!withdrawal || withdrawal.storeId !== user.storeId) {
            return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 });
        }

        if (withdrawal.status !== "PENDING_OTP") {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        // 2. Verify OTP
        if (withdrawal.otpCode !== otpCode) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }
        if (withdrawal.otpExpiresAt && new Date() > withdrawal.otpExpiresAt) {
            return NextResponse.json({ error: "OTP expired" }, { status: 400 });
        }

        // 3. Execute Transaction (Atomic)
        // - Deduct Balance
        // - Update Withdrawal Status
        // - Create Ledger Entry

        await prisma.$transaction(async (tx) => {
            // Re-fetch wallet with lock in production, simpler here
            const w = await tx.wallet.findUniqueOrThrow({ where: { storeId: user.storeId } });

            if (w.availableKobo < withdrawal.amountKobo) {
                throw new Error("Insufficient funds (balance changed)");
            }

            // Deduct
            await tx.wallet.update({
                where: { storeId: user.storeId },
                data: {
                    availableKobo: { decrement: withdrawal.amountKobo },
                    // Optionally move to 'held' state if payout is async, but simplifying to "deducted"
                }
            });

            // Update Withdrawal
            await tx.withdrawal.update({
                where: { id: withdrawalId },
                data: {
                    status: "PROCESSING",
                    otpCode: null, // clear sensitive
                }
            });

            // Ledger
            await tx.ledgerEntry.create({
                data: {
                    storeId: user.storeId,
                    referenceType: "WITHDRAWAL",
                    referenceId: withdrawal.id,
                    direction: "OUT", // Debit
                    account: "WALLET",
                    amount: new Prisma.Decimal(Number(withdrawal.amountKobo) / 100), // Convert Kobo to Decimal Unit
                    currency: "NGN",
                    description: `Withdrawal to bank`,
                }
            });
        });

        return NextResponse.json({
            success: true,
            message: "Withdrawal processing"
        });

    } catch (error: any) {
        console.error("Withdraw Confirm Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to confirm withdrawal" },
            { status: 500 },
        );
    }
}
