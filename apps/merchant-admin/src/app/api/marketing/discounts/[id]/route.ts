import { NextRequest, NextResponse } from "next/server";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { DiscountService } from "@/services/discount.service";

export const GET = withVayvaAPI(
    PERMISSIONS.MARKETING_VIEW,
    async (request: NextRequest, { storeId, params }: HandlerContext) => {

        try {
            const { id } = await params;
            const discount = await DiscountService.getDiscount(storeId, id);
        if (!discount) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(discount);
        } catch (error) {
            console.error("Get Discount Error", error);
            return NextResponse.json({ error: "Internal Error" }, { status: 500 });
        }
    }
);

export const PATCH = withVayvaAPI(
    PERMISSIONS.MARKETING_MANAGE,
    async (request: NextRequest, { storeId, params }: HandlerContext) => {

        try {
            const { id } = await params;
            const body = await request.json();
            
            const updated = await DiscountService.updateDiscount(storeId, id, {
            ...body,
            startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
            endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
        });

        return NextResponse.json(updated);
        } catch (error) {
            console.error("Update Discount Error", error);
            return NextResponse.json({ error: "Internal Error" }, { status: 500 });
        }
    }
);

export const DELETE = withVayvaAPI(
    PERMISSIONS.MARKETING_MANAGE,
    async (request: NextRequest, { storeId, params }: HandlerContext) => {

        try {
            const { id } = await params;
            await DiscountService.deleteDiscount(storeId, id);
        return NextResponse.json({ success: true });
        } catch (error) {
            console.error("Delete Discount Error", error);
            return NextResponse.json({ error: "Internal Error" }, { status: 500 });
        }
    }
);
