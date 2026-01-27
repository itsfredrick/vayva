import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const storeId = session.user.storeId;
        if (!storeId) {
            return NextResponse.json({ error: "No store context" }, { status: 400 });
        }

        // Fetch theme history for this store
        const history = await prisma.merchantThemeHistory.findMany({
            where: { storeId },
            orderBy: { createdAt: "desc" },
            take: 20,
        });

        const formatted = history.map((h: any) => ({
            id: h.id,
            version: "1.0",
            publishedAt: h.createdAt,
            author: h.changedByUserId || "System",
            status: "archived",
            description: h.reason || "",
            template: null,
            publishedBy: h.changedByUserId,
        }));

        return NextResponse.json(formatted);
    } catch (error: any) {
        console.error("GET /api/storefront/history error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
