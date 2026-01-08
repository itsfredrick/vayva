import { NextResponse } from "next/server";
import { prisma, BankBeneficiary } from "@vayva/db";
import { requireAuth } from "@/lib/auth/session";
import { checkPermission } from "@/lib/team/rbac";
import { PERMISSIONS } from "@/lib/team/permissions";
import { logAudit, AuditAction } from "@/lib/audit";

export async function GET() {
  try {
    const session = await requireAuth();
    await checkPermission(PERMISSIONS.SETTINGS_VIEW);
    const storeId = session.user.storeId;

    const accounts = await prisma.bankBeneficiary.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });

    // Mask account numbers (show ONLY last 4)
    const maskedAccounts = accounts.map((acc: BankBeneficiary) => ({
      id: acc.id,
      bankName: acc.bankName,
      accountNumber: `******${acc.accountNumber.slice(-4)}`,
      accountName: acc.accountName,
      isDefault: acc.isDefault,
    }));

    return NextResponse.json({ accounts: maskedAccounts });
  } catch (error: any) {
    console.error("Bank fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bank accounts" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { checkFeatureAccess } = await import("@/lib/auth/gating");
    const access = await checkFeatureAccess("bank_settings");
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
    await checkPermission(PERMISSIONS.PAYOUTS_MANAGE);

    const storeId = session.user.storeId;
    const body = await request.json();
    const { bankCode, bankName, accountNumber, accountName, isDefault } = body;

    // Validation
    if (!bankCode || !accountNumber || !accountName) {
      return NextResponse.json(
        { error: "Missing required bank details" },
        { status: 400 },
      );
    }

    if (accountNumber.length !== 10) {
      return NextResponse.json(
        { error: "Account number must be 10 digits" },
        { status: 400 },
      );
    }

    // Create or update beneficiary
    const beneficiary = await prisma.$transaction(async (tx: any) => {
      // If setting as default, unset others first
      if (isDefault) {
        await tx.bankBeneficiary.updateMany({
          where: { storeId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return await tx.bankBeneficiary.create({
        data: {
          storeId,
          bankCode,
          bankName: bankName || "Bank",
          accountNumber,
          accountName,
          isDefault: isDefault || false,
        },
      });
    });

    await logAudit({
      storeId,
      actor: {
        type: "USER",
        id: session.user.id,
        label: session.user.email || "Merchant",
      },
      action: "PAYOUTS_DESTINATION_CHANGED",
      after: { bankName, accountNumberLast4: accountNumber.slice(-4) },
    });

    return NextResponse.json({ success: true, beneficiary });
  } catch (error: any) {
    console.error("Bank update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update bank account" },
      { status: 500 },
    );
  }
}
