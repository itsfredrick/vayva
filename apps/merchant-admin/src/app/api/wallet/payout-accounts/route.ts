import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAuditEvent, AuditEventType } from "@/lib/audit";

/**
 * Real Payout Accounts Implementation
 * Replaces in-memory mock with BankBeneficiary DB model.
 */

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.storeId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const accounts = await prisma.bankBeneficiary.findMany({
      where: { storeId: session.user.storeId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payout accounts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.storeId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const storeId = session.user.storeId;
    const userId = session.user.id;

    const { bankName, bankCode, accountNumber, accountName, isDefault } = body;

    if (!bankCode || !accountNumber || !accountName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // If setting as default, unset others first
    if (isDefault) {
      await prisma.bankBeneficiary.updateMany({
        where: { storeId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await prisma.bankBeneficiary.create({
      data: {
        storeId,
        bankName: bankName || "Unknown Bank",
        bankCode,
        accountNumber,
        accountName,
        isDefault: isDefault || false,
      },
    });

    // Audit Log
    await logAuditEvent(storeId, userId, AuditEventType.PAYOUT_SETTING_CHANGED, {
      accountId: account.id,
      bank: account.bankName,
      accountLast4: account.accountNumber.slice(-4),
    });

    return NextResponse.json(account);
  } catch (error: any) {
    console.error("Payout accounts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save payout account" },
      { status: 500 }
    );
  }
}
