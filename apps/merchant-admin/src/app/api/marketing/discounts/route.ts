import { NextRequest, NextResponse } from "next/server";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { DiscountService } from "@/services/discount.service";

export const GET = withVayvaAPI(
    PERMISSIONS.MARKETING_VIEW,
    async (request: NextRequest, { storeId }: HandlerContext) => {

        try {
            const discounts = await DiscountService.listDiscounts(storeId);
        return NextResponse.json(discounts);
        } catch (error) {
            console.error("List Discounts Error", error);
            return NextResponse.json({ error: "Internal Error" }, { status: 500 });
        }
    }
);

export const POST = withVayvaAPI(
    PERMISSIONS.MARKETING_MANAGE,
    async (request: NextRequest, { storeId }: HandlerContext) => {

        try {
            const body = await request.json();
        // Basic validation could happen here or in service

        // Ensure dates are dates
        const payload = {
            ...body,
            startsAt: new Date(body.startsAt),
            endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
            valueAmount: body.valueAmount ? parseFloat(body.valueAmount) : undefined,
            valuePercent: body.valuePercent ? parseFloat(body.valuePercent) : undefined,
            minOrderAmount: body.minOrderAmount ? parseFloat(body.minOrderAmount) : undefined,
        };

            const result = await DiscountService.createDiscount(storeId, payload);
        return NextResponse.json({ success: true, result });
        } catch (error: any) {
            console.error("Create Discount Error", error);
            return NextResponse.json({ error: error.message || "Internal Error" }, { status: 400 });
        }
    }
);
