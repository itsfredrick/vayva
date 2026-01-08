import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";

export async function GET() {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    const beneficiaries = await prisma.bankBeneficiary.findMany({
      where: { storeId },
    });

    return NextResponse.json(beneficiaries);
  } catch (error: any) {
    console.error("Beneficiaries fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch beneficiaries" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;
    const body = await req.json();

    const { bankCode, bankName, accountNumber, accountName, isDefault } = body;

    if (!bankCode || !bankName || !accountNumber || !accountName) {
      return NextResponse.json(
        { error: "Missing account details" },
        { status: 400 },
      );
    }

    // If this is set as default, unset others first
    if (isDefault) {
      await prisma.bankBeneficiary.updateMany({
        where: { storeId },
        data: { isDefault: false },
      });
    }

    const beneficiary = await prisma.bankBeneficiary.create({
      data: {
        storeId,
        bankCode,
        bankName,
        accountNumber,
        accountName,
        isDefault: !!isDefault,
      },
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        storeId,
        actorType: "USER",
        actorId: session.user.id,
        actorLabel: session.user.email || "Merchant",
        action: "PAYOUT_METHOD_ADDED",
        entityType: "BankBeneficiary",
        entityId: beneficiary.id,
        correlationId: `payout-${Date.now()}`,
      },
    });

    return NextResponse.json(beneficiary);
  } catch (error: any) {
    console.error("Beneficiary create error:", error);
    return NextResponse.json(
      { error: "Failed to add payout method" },
      { status: 500 },
    );
  }
}
