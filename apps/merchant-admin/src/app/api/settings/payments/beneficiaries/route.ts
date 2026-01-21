import { NextRequest, NextResponse } from "next/server";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { prisma } from "@vayva/db";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withVayvaAPI(
    PERMISSIONS.SETTINGS_VIEW,
    async (req: NextRequest, { storeId }: HandlerContext) => {
        try {
            const beneficiary = await prisma.bankBeneficiary.findFirst({
                where: { storeId, isDefault: true }
            }) || await prisma.bankBeneficiary.findFirst({
                where: { storeId } // Fallback to any
            });

            if (!beneficiary) {
                return NextResponse.json(null);
            }

            return NextResponse.json({
                bankName: beneficiary.bankName,
                accountNumber: beneficiary.accountNumber,
                accountName: beneficiary.accountName,
                isVerified: true // Assuming verified if it exists in this table for now
            });

        } catch (error) {
            console.error("[BENEFICIARY_GET]", error);
            return NextResponse.json({ error: "Internal Error" }, { status: 500 });
        }
    }
);
