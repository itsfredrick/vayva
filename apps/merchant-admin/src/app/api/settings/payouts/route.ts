
import { NextRequest, NextResponse } from "next/server";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { prisma } from "@/lib/prisma";

export const GET = withVayvaAPI(
  PERMISSIONS.FINANCE_VIEW,
  async (req: NextRequest, { storeId }: HandlerContext) => {
    try {
      const beneficiaries = await prisma.bankBeneficiary.findMany({
        where: { storeId },
      });
      return NextResponse.json(beneficiaries);
    } catch (error: unknown) {
      console.error("Beneficiaries fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch beneficiaries" }, { status: 500 });
    }
  }
);

export const POST = withVayvaAPI(
  PERMISSIONS.PAYOUTS_MANAGE,
  async (req: NextRequest, { storeId, user, correlationId }: HandlerContext) => {
    try {
      const body = await req.json();

      const { bankCode, bankName, accountNumber, accountName, isDefault } = body;

      if (!bankCode || !bankName || !accountNumber || !accountName) {
        return NextResponse.json({ error: "Missing account details" }, { status: 400 });
      }

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

      await prisma.auditLog.create({
        data: {
          storeId,
          actorType: "USER",
          actorId: user.id,
          actorLabel: user.email || "Merchant",
          action: "PAYOUT_METHOD_ADDED",
          entityType: "BankBeneficiary",
          entityId: beneficiary.id,
          correlationId,
        },
      });

      return NextResponse.json(beneficiary);
    } catch (error: unknown) {
      console.error("Beneficiary create error:", error);
      return NextResponse.json({ error: "Failed to add payout method" }, { status: 500 });
    }
  }
);
