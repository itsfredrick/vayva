import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma, BankBeneficiary } from "@vayva/db";

export async function GET() {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    const accounts = await prisma.bankBeneficiary.findMany({
      where: { storeId },
      orderBy: { isDefault: "desc" },
    });

    const maskedAccounts = accounts.map((acc: BankBeneficiary) => ({
      id: acc.id,
      bankName: acc.bankName,
      accountNumber: `******${acc.accountNumber.slice(-4)}`,
      accountName: acc.accountName,
      isDefault: acc.isDefault,
      updatedAt: acc.updatedAt,
    }));

    return NextResponse.json({ accounts: maskedAccounts });
  } catch (error: any) {
    console.error("Payouts fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payout details" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { checkFeatureAccess } = await import("@/lib/auth/gating");
    const access = await checkFeatureAccess("payouts");
    if (!access.allowed) {
      return NextResponse.json(
        {
          error: access.reason,
          requiredAction: access.requiredAction,
        },
        { status: 403 },
      );
    }

    const session = await requireAuth();
    const storeId = session.user.storeId;
    const body = await request.json();
    const { bankName, accountNumber, accountName, id } = body;

    // Implementation would mirror POST in bank route but with update
    // For simplicity, we create a new one and set as default if it's a "Change Account" action

    const beneficiary = await prisma.$transaction(async (tx) => {
      await tx.bankBeneficiary.updateMany({
        where: { storeId, isDefault: true },
        data: { isDefault: false },
      });

      return await tx.bankBeneficiary.create({
        data: {
          storeId,
          bankName,
          accountNumber,
          accountName,
          bankCode: "000", // Placeholder
          isDefault: true,
        },
      });
    });

    const { logAuditEvent, AuditEventType } = await import("@/lib/audit");
    await logAuditEvent(
      storeId,
      session.user.id,
      AuditEventType.SETTINGS_CHANGED,
      {
        keysChanged: ["payout_destination"],
      },
    );

    return NextResponse.json({ success: true, beneficiary });
  } catch (error: any) {
    console.error("Payouts update error:", error);
    return NextResponse.json(
      { error: "Failed to update payout details" },
      { status: 500 },
    );
  }
}
