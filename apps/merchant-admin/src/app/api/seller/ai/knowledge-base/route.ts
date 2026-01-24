import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
export async function GET(req: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const storeId = session.user.storeId;
        if (!storeId) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }
        const entries = await prisma.knowledgeBaseEntry.findMany({
            where: { storeId },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ data: entries });
    }
    catch (error: any) {
        console.error("Failed to fetch KB entries", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
