import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        const wallet = await prisma.wallet.findUnique({
            where: { storeId },
            select: { pinSet: true }
        });

        return NextResponse.json({
            pinSet: wallet?.pinSet || false
        });
    }
    catch (error) {
        return NextResponse.json({ pinSet: false }, { status: 500 });
    }
}
