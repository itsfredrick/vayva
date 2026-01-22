
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const PATCH = withVayvaAPI(
    PERMISSIONS.MARKETING_MANAGE,
    async (req: NextRequest, { storeId, params }: HandlerContext) => {
        try {
            const { id } = await params;
            const body = await req.json();

            // Validate ownership
            const existing = await prisma.flashSale.findUnique({
                where: { id },
            });

            if (!existing || existing.storeId !== storeId) {
                return NextResponse.json({ error: "Flash sale not found" }, { status: 404 });
            }

            const updated = await prisma.flashSale.update({
                where: { id },
                data: {
                    name: body.name !== undefined ? body.name : undefined,
                    discount: body.discount !== undefined ? Number(body.discount) : undefined,
                    startTime: body.startTime ? new Date(body.startTime) : undefined,
                    endTime: body.endTime ? new Date(body.endTime) : undefined,
                    isActive: body.isActive !== undefined ? body.isActive : undefined,
                    targetType: body.targetType !== undefined ? body.targetType : undefined,
                    targetId: body.targetId !== undefined ? body.targetId : undefined,
                },
            });

            return NextResponse.json({ success: true, data: updated });
        } catch (error: unknown) {
            console.error("Update Flash Sale Error:", error);
            return NextResponse.json({ error: "Failed to update flash sale" }, { status: 500 });
        }
    }
);

export const DELETE = withVayvaAPI(
    PERMISSIONS.MARKETING_MANAGE,
    async (req: NextRequest, { storeId, params }: HandlerContext) => {
        try {
            const { id } = await params;

            // Validate ownership
            const existing = await prisma.flashSale.findUnique({
                where: { id },
            });

            if (!existing || existing.storeId !== storeId) {
                return NextResponse.json({ error: "Flash sale not found" }, { status: 404 });
            }

            await prisma.flashSale.delete({
                where: { id },
            });

            return NextResponse.json({ success: true });
        } catch (error: unknown) {
            console.error("Delete Flash Sale Error:", error);
            return NextResponse.json({ error: "Failed to delete flash sale" }, { status: 500 });
        }
    }
);
