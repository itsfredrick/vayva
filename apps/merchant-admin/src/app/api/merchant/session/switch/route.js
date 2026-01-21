import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const POST = withVayvaAPI(PERMISSIONS.COMMERCE_VIEW, async (req, { user }) => {
    try {
        const { storeId: targetStoreId } = await req.json();
        if (!targetStoreId)
            return NextResponse.json({ error: "Store ID required" }, { status: 400 });
        // Verify membership for target store
        const membership = await prisma.membership.findFirst({
            where: {
                userId: user.id,
                storeId: targetStoreId,
            },
        });
        if (!membership) {
            return NextResponse.json({ error: "Access Denied" }, { status: 403 });
        }
        // Set Cookie for Persistence
        const response = NextResponse.json({ success: true, storeId: targetStoreId });
        response.cookies.set("x-active-store-id", targetStoreId, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
        return response;
    }
    catch (error) {
        console.error("Session Switch Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
});
