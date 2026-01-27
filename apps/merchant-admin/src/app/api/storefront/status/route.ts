import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
export async function GET() {
    const user = await getSessionUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const store = await prisma.store.findUnique({
        where: { id: user.storeId },
        select: { isLive: true, updatedAt: true },
    });

    const isLive = Boolean(store?.isLive);
    return NextResponse.json({
        status: isLive ? "live" : "draft",
        reasons: [],
        updated_at: (store?.updatedAt || new Date()).toISOString(),
    });
}
